import { Plugin } from "obsidian";

class PlateView {
  static renderPlate(container: HTMLElement, data: Record<string, string>) {
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
}

export default class TissueCulturePlugin extends Plugin {
  async onload() {
    this.registerMarkdownCodeBlockProcessor("tissue-plate", async (source: string, el: HTMLElement) => {
      const data = this.parsePlateData(source);
      PlateView.renderPlate(el, data);
    });
  }

  parsePlateData(source: string): Record<string, string> {
    const lines = source.split("\n");
    const data: Record<string, string> = {};
    for (const line of lines) {
      const [key, value] = line.split(":").map(s => s.trim());
      if (key && value) data[key.toUpperCase()] = value;
    }
    return data;
  }
}
