'use strict';

// Original author: fossamagna <fossamagna2@gmail.com>
//  - https://github.com/fossamagna/gas-webpack-plugin
//  - Licensed under MIT License
//  - Parent commit: 56a5c897c7ca12c9a4c4aa03de45750e310bee4a

const { generate } = require('./gas-entry-generator.js');
const { SourceMapSource, RawSource } = require('webpack-sources');
const Dependency = require('webpack/lib/Dependency');
const minimatch = require('minimatch');
const path = require('path');

const defaultOptions = {
  comment: true,
};

function GasPlugin(options) {
  this.options = Object.assign({}, defaultOptions, options || {});
}

function gasify(compilation, chunk, entryFunctions) {
  chunk.files.forEach(function (filename) {
    const asset = compilation.assets[filename];
    let source, map;
    if (asset.sourceAndMap) {
      let sourceAndMap = asset.sourceAndMap();
      source = sourceAndMap.source;
      map = sourceAndMap.map;
    } else {
      source = asset.source();
      map = typeof asset.map === 'function' ? asset.map() : null;
    }

    const entries = chunk
      .getModules()
      .filter((module) => !!entryFunctions.get(module.id))
      .map((module) => entryFunctions.get(module.id).entryPointFunctions)
      .filter((entries) => !!entries)
      .join('\n');

    const gasify = entries + source;
    compilation.assets[filename] = map
      ? new SourceMapSource(gasify, filename, map)
      : new RawSource(gasify);
  });
}

class GasDependency extends Dependency {
  constructor(module) {
    super();
    this.module = module;
  }
}

GasDependency.Template = class GasDependencyTemplate {
  constructor(options) {
    this.comment = options.comment;
    this.entryFunctions = new Map();
  }

  apply(dep, source) {
    const module = dep.module;
    const options = {
      comment: this.comment,
      /* module.resource &&
        this.patterns.some((file) => minimatch(module.resource, file)), */
    };
    const output = generate(source.source(), options);
    this.entryFunctions.set(module.id, output);
  }
};

GasPlugin.prototype.apply = function (compiler) {
  const context = compiler.options.context;

  const plugin = { name: 'GasPlugin' };
  const compilationHook = (compilation) => {
    const gasDependencyTemplate = new GasDependency.Template({
      comment: this.options.comment,
    });

    compilation.dependencyTemplates.set(GasDependency, gasDependencyTemplate);

    compilation.hooks.buildModule.tap('GasPlugin', (module) => {
      module.addDependency(new GasDependency(module));
    });

    compilation.hooks.optimizeChunkAssets.tapAsync(
      plugin,
      (chunks, callback) => {
        chunks.forEach((chunk) => {
          gasify(compilation, chunk, gasDependencyTemplate.entryFunctions);
        });
        callback();
      }
    );
  };

  if (compiler.hooks) {
    compiler.hooks.compilation.tap(plugin, compilationHook);
  } else {
    compiler.plugin('compilation', compilationHook);
  }
};

module.exports = GasPlugin;
