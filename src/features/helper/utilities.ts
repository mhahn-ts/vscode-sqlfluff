import * as vscode from "vscode";

import Variables from "./types/variables";

export default class Utilities {
  static outputChannel = vscode.window.createOutputChannel("SQLFluff");

  public static appendHyphenatedLine(newLines = true) {
    if (newLines) {
      Utilities.outputChannel.appendLine("\n------------------------------------------------------------\n");
    } else {
      Utilities.outputChannel.appendLine("------------------------------------------------------------");
    }
  }

  static interpolateString(command: string, variables: Variables): string {
    const regex = /\$\{([^\}]+)\}/g; // eslint-disable-line no-useless-escape

    const match = command.match(regex);
    while (match?.length) {
      const placeholder = match.pop();
      const path = placeholder?.replace("${", "").replace("}", "");
      if (path && placeholder) {
        const variable: any = variables[path as keyof Variables];
        if (variable) {
          command = command.replace(placeholder, variable);
        }
      }
    }

    return command;
  }

  public static normalizePath(path: string, allowEscapes = false): string {
    if (path === undefined) {
      return path;
    }

    // Capitalize drive letter
    path = path.replace(/^[A-Za-z]:/, match => match.toUpperCase());

    if (allowEscapes) {
      return path.replace(/\\{2,}/g, "/");
    }

    return path.replace(/\\+/g, "/");
  }

  public static async sleep(milliseconds: number) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
  }
}
