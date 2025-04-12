Display PlateLayout for common Tissue Culture Plates in ObsidianMD

# Install

- Clone Rep.
- Copy main.js, style.css, and mainfest.json into plugin directorry: (e.g. ".obsidian/plugins/obsidian-tissue-culture"

# Use

Create a Plate Layout:

```tissue-plate
A1: Control
B2,B3: Treatment
C1-C6: Treatment_2
```

Choose layout/plate-size via `@plate` available are(6,12,24,48,96)

```tissue-plate
@plate: 24
A1, A2: Control
B2: Treatment
```


Customize textcolor and fontsize

```tissue-plate
@textColor: #000000
@fontSize: 14px
```
