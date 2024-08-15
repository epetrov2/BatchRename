import * as fs from 'fs';

const rootFolder = 'D:\\РМП\\small2';
const dictionaryPath = './Dictionary.csv';
const dictionarySeparator = ';';
const filesExt = '.jpg';
const flagTestRun = true;
const flagRemoveSpaces = true;
const newSeparator = "-"; //"\\"

const words: string[] = fs
    .readFileSync(dictionaryPath, 'utf-8')
    .split('\r\n');
console.log(words);

let map = new Map<string, string>();
words.forEach((element: string) => {
    if (words.length > 0) {
        let tuple = element.split(dictionarySeparator);
        map.set(tuple[0].toLowerCase(), tuple[1]);
    }
});

function pad(num: number, size: number): string {
    let result = num.toString();
    while (result.length < size) result = "0" + result;
    return result;
}

let lastPath = '';
let counter = 1;
let newPath = "";
let convertedPath = "";

fs.readdirSync(rootFolder, { recursive: true }).forEach((file: any) => {
    let fileName: string = file;
    fileName = fileName.toLowerCase();

    if (fileName.endsWith(filesExt)) {
        const thisPath = fileName.substring(0, fileName.lastIndexOf("\\"));
        if (thisPath !== "") {
            console.log("i " + fileName);
            if (lastPath === thisPath) {
                counter++;
            } else {
                counter = 1;
                lastPath = thisPath;
                let path = fileName.split("\\");
                convertedPath = "";
                for (let i = 0; i < path.length - 1; i++) {
                    let ch = map.get(path[i]);
                    if (ch === undefined) ch = path[i];
                    convertedPath += ch + newSeparator;
                }
            }
            newPath = convertedPath + pad(counter, 2) + filesExt;
            if (flagRemoveSpaces) {
                while (newPath.includes(" ")) newPath = newPath.substring(0, newPath.indexOf(' ')) + newPath.substring(newPath.indexOf(' ') + 1);
            } else {
                if (newPath.includes(" ")) console.log("! " + newPath + " - space");
            }

            let nonLatin = false;
            for (const c of newPath) {
                if (c > "z") {
                    console.log("! " + newPath + " - non-latin char");
                    nonLatin = true;
                    break;
                }
            }
            if (!nonLatin) {
                console.log("o " + newPath);
                if (!flagTestRun) {
                    fs.renameSync(
                        rootFolder + "\\" + fileName,
                        rootFolder + "\\" + newPath
                    );
                }
            }
        }
    }
});
