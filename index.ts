import { Plugin } from "obsidian";

export class PlateView {
  static renderPlate(
    container: HTMLElement,
    data: Record<string, string>,
    config: Record<string, string>
  ) {
    const plateLayouts: Record<string, { rows: string[]; cols: number[] }> = {
      "6": { rows: ["A", "B"], cols: [1, 2, 3] },
      "12": { rows: ["A", "B", "C"], cols: [1, 2, 3, 4] },
      "24": { rows: ["A", "B", "C", "D"], cols: [1, 2, 3, 4, 5, 6] },
      "48": { rows: ["A", "B", "C", "D", "E", "F"], cols: Array.from({ length: 8 }, (_, i) => i + 1) },
      "96": { rows: ["A", "B", "C", "D", "E", "F", "G", "H"], cols: Array.from({ length: 12 }, (_, i) => i + 1) }
    };

    const plateType = config["plate"] || "24";
    const layout = plateLayouts[plateType];

    if (!layout) {
      container.innerText = `Unsupported plate type: ${plateType}`;
      return;
    }

    const textColor = config["textColor"] || "#000";
    const fontSize = config["fontSize"] || "11px";

    const uniqueConditions = Array.from(new Set(Object.values(data)));
    const conditionColors = new Map<string, string>();
    const colorPalette = [
      "#90caf9", "#a5d6a7", "#ffcc80", "#f48fb1",
      "#ce93d8", "#fff59d", "#80deea", "#ef9a9a",
      "#bcaaa4", "#b0bec5", "#ffab91", "#b39ddb"
    ];

    uniqueConditions.forEach((cond, i) => {
      const color = colorPalette[i % colorPalette.length];
      conditionColors.set(cond, color);
    });

    const table = document.createElement("table");
    table.className = "tissue-plate";

    for (const row of layout.rows) {
      const tr = document.createElement("tr");
      for (const col of layout.cols) {
        const wellId = `${row}${col}`;
        const td = document.createElement("td");
        td.className = "well";
        const condition = data[wellId];

        if (condition) {
          td.style.backgroundColor = conditionColors.get(condition) || "#ccc";
          td.innerHTML = `
            <div class="well-id" style="color: ${textColor}; font-size: ${fontSize};">${wellId}</div>
            <div class="well-label" style="color: ${textColor}; font-size: ${fontSize};">${condition}</div>
          `;
        } else {
          td.innerHTML = `<div class="well-id" style="color: ${textColor}; font-size: ${fontSize};">${wellId}</div>`;
        }

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
        const { wells, config } = this.parsePlateData(source);
        PlateView.renderPlate(el, wells, config);
        
    });
  }

  parsePlateData(source: string): { wells: Record<string, string>, config: Record<string, string> } {
    const lines = source.split("\n");
    const wells: Record<string, string> = {};
    const config: Record<string, string> = {};
  
    const normalizeWell = (raw: string): string | null => {
      const match = raw.trim().toUpperCase().match(/^([A-H])(\d{1,2})$|^(\d{1,2})([A-H])$/);
      if (!match) return null;
  
      const row = match[1] || match[4];
      const col = match[2] || match[3];
      return `${row}${parseInt(col, 10)}`;
    };
  
    const expandRange = (start: string, end: string): string[] => {
      const normStart = normalizeWell(start);
      const normEnd = normalizeWell(end);
      if (!normStart || !normEnd) return [];
  
      const rowStart = normStart[0];
      const rowEnd = normEnd[0];
      const colStart = parseInt(normStart.slice(1));
      const colEnd = parseInt(normEnd.slice(1));
  
      const rows = [..."ABCDEFGH"];
      const startRowIndex = rows.indexOf(rowStart);
      const endRowIndex = rows.indexOf(rowEnd);
  
      const result: string[] = [];
  
      for (let r = Math.min(startRowIndex, endRowIndex); r <= Math.max(startRowIndex, endRowIndex); r++) {
        for (let c = Math.min(colStart, colEnd); c <= Math.max(colStart, colEnd); c++) {
          result.push(`${rows[r]}${c}`);
        }
      }
  
      return result;
    };
  
    for (const line of lines) {
      if (line.trim().startsWith("@")) {
        const [key, value] = line.trim().substring(1).split(":").map(s => s.trim());
        if (key && value) config[key] = value;
      } else {
        const [wellListRaw, condition] = line.split(":").map(s => s.trim());
        if (!wellListRaw || !condition) continue;
  
        const parts = wellListRaw.split(",").map(s => s.trim());
        const wellIds: string[] = [];
  
        for (const part of parts) {
          if (part.includes("-")) {
            const [start, end] = part.split("-").map(s => s.trim());
            wellIds.push(...expandRange(start, end));
          } else {
            const norm = normalizeWell(part);
            if (norm) wellIds.push(norm);
          }
        }
  
        for (const well of wellIds) {
          wells[well] = condition;
        }
      }
    }
  
    return { wells, config };
  }
  
  
  
}
