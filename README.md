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
const template = Template.parse("<template>{{a + b}}</template>", {
    dataset: {
      a: 1,
      b: 2
    }
});
console.log(result);  // <template>3</template>
```

