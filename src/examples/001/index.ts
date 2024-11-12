import fs from "fs";
import path from "path";

import { Template } from "../../";

const content = fs.readFileSync(path.join(__dirname, "template.xml")).toString();

const template = Template.parse(content);

const result = template.render({
    pretty: true
});

fs.writeFileSync(path.join(__dirname, "result.xml"), result);
