'use strict';

// Original author: fossamagna <fossamagna2@gmail.com>
//  - https://github.com/fossamagna/gas-entry-generator
//  - Licensed under MIT License
//  - Parent commit: ba3dd8bd6d0a7b2b94050bd91d2ac5de05979234

const esprima = require('esprima');
const estraverse = require('estraverse');
const escodegen = require('escodegen');

function createBaseAST() {
  const ast = {};
  ast.type = 'Program';
  ast.body = [];
  return ast;
}

function createStubFunctionASTNode(functionName, leadingComments, params) {
  const node = {
    type: 'FunctionDeclaration',
    id: {
      type: 'Identifier',
      name: functionName,
    },
    params: [],
    defaults: [],
    body: {
      type: 'BlockStatement',
      body: [],
    },
    generator: false,
    expression: false,
  };
  if (leadingComments) {
    node.leadingComments = leadingComments;
  }
  if (params) {
    node.params = params;
    node.body[0].arguments = params;
  }
  return node;
}

class EntryPointFunctions {
  constructor() {
    this.stubs = new Map();
    this.functionNames = [];
  }

  add(functionName, params, comments) {
    let index = this.functionNames.indexOf(functionName);
    if (index === -1) {
      index = this.functionNames.push(functionName) - 1;
    }
    this.stubs.set(
      index,
      createStubFunctionASTNode(functionName, comments, params)
    );
  }

  getEntryPointFunctions() {
    const entryPointFunctions = [];
    for (let index = 0; index < this.functionNames.length; index++) {
      entryPointFunctions.push(this.stubs.get(index));
    }
    return entryPointFunctions;
  }
}

function _generateStubs(ast, options) {
  const entryPointFunctions = new EntryPointFunctions();
  estraverse.traverse(ast, {
    leave: function (node) {
      if (
        node.type === 'ExpressionStatement' &&
        isGlobalAssignmentExpression(node.expression)
      ) {
        const functionName = node.expression.left.property.name;
        entryPointFunctions.add(
          functionName,
          node.expression.right.params,
          node.leadingComments
        );
      } else if (
        node.type === 'ExpressionStatement' &&
        node.expression.type === 'SequenceExpression'
      ) {
        node.expression.expressions.forEach(function (expression) {
          if (isGlobalAssignmentExpression(expression)) {
            const functionName = expression.left.property.name;
            entryPointFunctions.add(
              functionName,
              expression.right.params,
              expression.leadingComments
                ? expression.leadingComments
                : node.leadingComments
            );
          }
        });
      }
      /* if (autoGlobalExports) {
        if (
          node.type === 'ExpressionStatement' &&
          isNamedExportsAssignmentExpression(node.expression)
        ) {
          const functionName = node.expression.left.property.name;
          entryPointFunctions.add(
            functionName,
            node.expression.right.params,
            node.leadingComments
          );
        } else if (
          node.type === 'ExpressionStatement' &&
          node.expression.type === 'SequenceExpression'
        ) {
          node.expression.expressions.forEach(function (expression) {
            if (isNamedExportsAssignmentExpression(expression)) {
              const functionName = expression.left.property.name;
              entryPointFunctions.add(
                functionName,
                expression.right.params,
                expression.leadingComments
                  ? expression.leadingComments
                  : node.leadingComments
              );
            }
          });
        }
      } */
    },
  });

  return entryPointFunctions.getEntryPointFunctions();
}

function isGlobalAssignmentExpression(node) {
  return (
    node.type === 'AssignmentExpression' &&
    node.operator === '=' &&
    node.left.type === 'MemberExpression' &&
    node.left.object.type === 'Identifier' &&
    node.left.object.name === 'global'
  );
}

function isNamedExportsAssignmentExpression(node) {
  return (
    node.type === 'AssignmentExpression' &&
    node.operator === '=' &&
    node.left.type === 'MemberExpression' &&
    node.left.object.type === 'Identifier' &&
    node.left.object.name === 'exports' &&
    node.left.property.type === 'Identifier' &&
    node.left.property.name !== 'default'
  );
}

function generateStubs(ast, options) {
  const baseAST = createBaseAST();
  const stubs = _generateStubs(ast, options);
  baseAST.body.push(...stubs);
  return escodegen.generate(baseAST, { comment: !!options.comment });
}

exports.generate = function (source, options = { comment: false }) {
  const ast = esprima.parseModule(source, { attachComment: options.comment });
  const functions = generateStubs(ast, options);

  return {
    entryPointFunctions: functions,
  };
};
