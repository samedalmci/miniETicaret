export class Menu {
  Name: string;
  Actions: Action[];
}

export class Action {
  ActionType: string;
  HttpType: string;
  Definition: string;
  Code: string;
}
