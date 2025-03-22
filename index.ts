import { Plugin } from "obsidian";

export class PlateView {
    static renderPlate(container: HTMLElement, data: Record<string, string>, config: Record<string, string>){
      const rows = ["A", "B", "C", "D"];
      const cols = [1, 2, 3, 4, 5, 6];

      const textColor = config["textColor"] || "#000000";
      const fontSize = config["fontSize"] || "11px";

  
      // Assign colors to each unique condition
      const uniqueConditions = Array.from(new Set(Object.values(data)));
      const conditionColors = new Map<string, string>();
      const colorPalette = [
        "#90caf9", // blue
        "#a5d6a7", // green
        "#ffcc80", // orange
        "#f48fb1", // pink
        "#ce93d8", // purple
        "#fff59d", // yellow
        "#80deea", // cyan
        "#ef9a9a"  // red
      ];
  
      uniqueConditions.forEach((condition, index) => {
        const color = colorPalette[index % colorPalette.length];
        conditionColors.set(condition, color);
      });
  
      const table = document.createElement("table");
      table.className = "tissue-plate";
  
      for (const row of rows) {
        const tr = document.createElement("tr");
        for (const col of cols) {
          const wellId = `${row}${col}`;
          const td = document.createElement("td");
          td.className = "well";
          td.textContent = wellId;
  
          const condition = data[wellId];
          if (condition) {
            td.style.backgroundColor = conditionColors.get(condition) || "#cfcfcf";
            td.innerHTML = `
                <div class="well-id" style="color: ${textColor}; font-size: ${fontSize};">${wellId}</div>
                <div class="well-label" style="color: ${textColor}; font-size: ${fontSize};">${condition}</div>`;
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
  
    for (const line of lines) {
      if (line.trim().startsWith("@")) {
        const [key, value] = line.trim().substring(1).split(":").map(s => s.trim());
        if (key && value) config[key] = value;
      } else {
        const [well, label] = line.split(":").map(s => s.trim());
        if (well && label) wells[well.toUpperCase()] = label;
      }
    }
  
    return { wells, config };
  }
  
}
