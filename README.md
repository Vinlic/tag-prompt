# Tag Prompt

Dynamically build your semantic LLM Prompt template! Tag Prompt allows you to create structured prompts using XML-like syntax with powerful inline JavaScript expressions and semantic elements, making prompts more effective and maintainable for LLMs.

## Installing

```bash
$ npm install tag-prompt
```

## Features

- Semantic XML-like syntax for better LLM comprehension
- Fully customizable elements for structured prompting
- Powerful inline JavaScript expressions
- Custom function extensions
- Array iteration and loop support
- Conditional rendering

## Why Semantic Templates?

Tag Prompt's semantic structure helps LLMs better understand and follow instructions by:

- Providing clear role and context definitions
- Organizing reference materials systematically
- Breaking down complex tasks into logical steps
- Maintaining consistent styling and formatting
- Structuring output expectations clearly

As documented in [Anthropic's Claude documentation](https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/use-xml-tags), using XML tags in prompts:
- Improves clarity and helps LLMs parse prompts more accurately
- Reduces errors caused by misinterpreting parts of the prompt
- Makes prompts more maintainable and easier to modify
- Enables better structured outputs for post-processing

Example of semantic prompting:

```javascript
const template = Template.parse(`
<template>
    <!-- Define the AI's role clearly -->
    <role>You are a professional code reviewer</role>

    <!-- Provide context and materials -->
    <context>
        <language>JavaScript</language>
        <focus-areas>
            <area>Code quality</area>
            <area>Performance</area>
            <area>Security</area>
        </focus-areas>
    </context>

    <!-- Reference materials -->
    <reference>
        <code-snippet language="javascript">{{sourceCode}}</code-snippet>
        <requirements>{{projectStandards}}</requirements>
    </reference>

    <!-- Guide the review process -->
    <instructions>
        <steps>
            <step>Analyze the code structure</step>
            <step>Check for security vulnerabilities</step>
            <step>Assess performance implications</step>
            <step>Suggest improvements</step>
        </steps>
    </instructions>

    <!-- Define output format -->
    <output-format>
        ```json
        {
            "summary": "...",
            "issues": ["..."],
            "recommendations": ["..."]
        }
        ```
    </output-format>
</template>
`);
console.log(template.render());
```

## QuickStart

Basic example with inline expressions:

```javascript
import { Template } from "tag-prompt";

const template = Template.parse("<template>{{Math.floor(Math.random() * 100)}}</template>");
console.log(template.render());  // Outputs a random number between 0-99
```

Example with semantic elements for LLM interaction:

```javascript
const template = Template.parse(`
<template>
    <system>
        <!-- Define AI behavior -->
        <role>You are a data analysis assistant</role>
        <capabilities>
            <capability>Statistical analysis</capability>
            <capability>Data visualization</capability>
        </capabilities>
    </system>

    <input>
        <!-- Structured data input -->
        <dataset name="{{datasetName}}">
            <description>{{dataDescription}}</description>
            <records for="{{data}}">
                <record>{{item.value}}</record>
            </records>
        </dataset>
    </input>

    <task>
        <!-- Clear task definition -->
        <objective>{{analysisObjective}}</objective>
        <constraints if="{{hasConstraints}}">
            {{constraints}}
        </constraints>
    </task>

    <output-format>
        ```json
        {
            "result": "..."
        }
        ```
    </output-format>
</template>
`);
  
```

## Extended Functions

You can add custom functions to use in your templates:

```javascript
const template = Template.parse(`
<template>
    <formatted-date>{{formatDate(date, 'YYYY-MM-DD')}}</formatted-date>
    <calculated>{{customMath(value1, value2)}}</calculated>
</template>
`, {
    dataset: {
        date: new Date(),
        value1: 10,
        value2: 20
    },
    functions: {
        formatDate: (date, format) => dayjs(date).format(format),
        customMath: (a, b) => a * b + 100
    }
});
console.log(template.render());
```

## Template Syntax

### Inline Expressions
- Use `{{expression}}` for JavaScript expressions
- Full access to JavaScript methods and operators
- Support for ternary operators: `{{condition ? 'yes' : 'no'}}`

### Iteration
```javascript
<items for="{{arrayData}}">
    <item>{{item.property}}</item>
</items>
```

### Conditional Rendering
```javascript
<element if="{{condition}}">Shown if true</element>
<element else>Shown if false</element>
```

## Custom Elements

You can use any custom element names in your template:

```javascript
const template = Template.parse(`
<template>
    <my-custom-element>
        <nested-element>{{data}}</nested-element>
    </my-custom-element>
    <another-element style="{{styles.main}}">
        {{computedValue}}
    </another-element>
</template>
`);
console.log(template.render());
```

## Render Options

```typescript
interface RenderOptions {
    rootName?: string;  // Custom root element name (default: 'template')
    pretty?: boolean;   // Enable pretty printing
}
```