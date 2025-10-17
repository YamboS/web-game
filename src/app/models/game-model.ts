export interface AreaContent {
  title: string;
  description: string;
}

export class GameArea {
  static readonly areas = {
    // Manager's Office Areas
    board: {
      title: "Meeting Board",
      description: "A board covered in papers maybe it'll have some answers for the door code."
    },
    papers: {
      title: "Scattered Papers",
      description: "Some documents are spread across the desk. They look important."
    },
    calendar: {
      title: "Desk Calendar",
      description: "A calendar with several dates circled in red. Something important was planned."
    },
    // Lunch Room Areas
    lunch_table: {
      title: "Lunch Table",
      description: "Several empty coffee cups and half-eaten snacks are scattered on the table. Someone left in a hurry."
    },
    vending_machine: {
      title: "Vending Machine",
      description: "The vending machine hums quietly. Something seems odd about the maintenance panel."
    },
    notice_board: {
      title: "Coffee area",
      description: "Just a drip coffee machine"
    },
    // Janitor's Closet Areas
    cleaning_supplies: {
      title: "Cleaning Supplies",
      description: "Shelves lined with various cleaning products. Some bottles look like they've been moved recently."
    },
    computer: {
      title: "computer",
      description: "Looks like an old computer. It might still work."
    },
    toolbox: {
      title: "Toolbox",
      description: "A red metal toolbox sits on the bottom shelf. It might contain something useful."
    },
    keypad: {
      title: "Keypad",
      description: "A numeric keypad with a small screen. It seems to be the final lock."
    }
    
  };

  static getArea(areaId: string): AreaContent | undefined {
    return this.areas[areaId as keyof typeof this.areas];
  }
}