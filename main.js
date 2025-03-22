"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// index.ts
var index_exports = {};
__export(index_exports, {
  default: () => TissueCulturePlugin
});
module.exports = __toCommonJS(index_exports);
var import_obsidian = require("obsidian");
var PlateView = class {
  static renderPlate(container, data) {
    const rows = ["A", "B", "C", "D"];
    const cols = [1, 2, 3, 4, 5, 6];
    const table = document.createElement("table");
    table.className = "tissue-plate";
    for (const row of rows) {
      const tr = document.createElement("tr");
      for (const col of cols) {
        const wellId = `${row}${col}`;
        const td = document.createElement("td");
        td.className = "well";
        td.textContent = wellId;
        td.title = data[wellId] || "";
        if (data[wellId]) td.classList.add("filled");
        tr.appendChild(td);
      }
      table.appendChild(tr);
    }
    container.appendChild(table);
  }
};
var TissueCulturePlugin = class extends import_obsidian.Plugin {
  async onload() {
    this.registerMarkdownCodeBlockProcessor("tissue-plate", async (source, el) => {
      const data = this.parsePlateData(source);
      PlateView.renderPlate(el, data);
    });
  }
  parsePlateData(source) {
    const lines = source.split("\n");
    const data = {};
    for (const line of lines) {
      const [key, value] = line.split(":").map((s) => s.trim());
      if (key && value) data[key.toUpperCase()] = value;
    }
    return data;
  }
};
