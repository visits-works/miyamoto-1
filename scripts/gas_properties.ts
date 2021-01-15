// KVS
// でも今回は使ってないです

export class GASProperties {
  private properties: GoogleAppsScript.Properties.Properties;
  constructor() {
    this.properties = PropertiesService.getScriptProperties();
  }
  get(key: string) {
    return this.properties.getProperty(key);
  }
  set(key: string, val: string) {
    this.properties.setProperty(key, val);
    return val;
  }
}
