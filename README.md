# Tag Prompt

Dynamically build your semantic LLM Prompt template!

## Installing

```bash
$ npm install tag-prompt
```

## QuickStart

![example](https://github.com/Vinlic/tag-prompt/blob/main/doc/example-1.png)

```javascript
import { Template } from "tag-prompt";
const template = Template.parse('<template>{{1 + 1}}</template>');
const result = template.render({ pretty: true });
console.log(result);  // <template>2</template>
```

