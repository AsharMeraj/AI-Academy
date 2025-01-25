import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY as string;
if (!apiKey) {
  throw new Error("API key is not set in the environment variables.");
}

const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "application/json",
};



export const courseOutlineAIModel = model.startChat({
  generationConfig,
  history: [
    {
      role: "user",
      parts: [
        {
          text: "Generate a study material for Python for Exam and level of difficulty will be beginner with summary of course, List of chapters (Max 3) along with summary and Emoji icon for each chapter, Topic list for each chapter. All result in JSON format",
        },
      ],
    },
    {
      role: "model",
      parts: [
        { text: "```json\n{\n  \"courseSummary\": \"This introductory Python course covers the fundamental concepts and syntax needed to start programming in Python.  It's designed for beginners with no prior programming experience.  Upon completion, you will be able to write basic Python programs, understand data types, control flow, and fundamental data structures.\",\n  \"chapters\": [\n    {\n      \"chapterTitle\": \"Introduction to Python and Basic Syntax\",\n      \"emoji\": \"🐍\",\n      \"chapterSummary\": \"This chapter introduces the basics of Python, including setting up your environment, understanding variables, data types (integers, floats, strings, booleans), operators, and basic input/output.\",\n      \"topics\": [\n        \"Installing Python\",\n        \"Running Python code (Interactive shell & scripts)\",\n        \"Variables and Data Types (int, float, str, bool)\",\n        \"Operators (Arithmetic, Comparison, Logical)\",\n        \"Basic Input and Output (print(), input())\",\n        \"Comments in Python\",\n        \"String manipulation (basic slicing and concatenation)\"\n      ]\n    },\n    {\n      \"chapterTitle\": \"Control Flow and Data Structures\",\n      \"emoji\": \"🚦\",\n      \"chapterSummary\": \"This chapter covers conditional statements (if, elif, else), loops (for and while), and introduces fundamental data structures like lists and tuples.\",\n      \"topics\": [\n        \"Conditional Statements (if, elif, else)\",\n        \"Looping Constructs (for loop, while loop)\",\n        \"List creation and manipulation (append, insert, remove, indexing, slicing)\",\n        \"Tuples: creation and accessing elements\",\n        \"Iteration over lists and tuples\",\n        \"Nested loops\"\n      ]\n    },\n    {\n      \"chapterTitle\": \"Functions and Basic File Handling\",\n      \"emoji\": \"📁\",\n      \"chapterSummary\": \"This chapter introduces the concept of functions for code reusability and modularity and covers basic file input/output operations.\",\n      \"topics\": [\n        \"Defining and calling functions\",\n        \"Function parameters and arguments\",\n        \"Return values from functions\",\n        \"Scope of variables\",\n        \"Opening, reading, and writing to text files\",\n        \"Error Handling (basic try-except blocks)\"\n      ]\n    }\n  ]\n}\n```\n" },
      ],
    },
  ],
});

export const generateNotesAiModel = model.startChat({
  generationConfig,
  history: [
    {
      role: "user",
      parts: [
        {text: "Generate detailed content in JSON format. The output should contain an object with a key-value pair chapters, where the chapter is an object. The chapter should include:\nheading: Main heading of the chapter with given emoji an the end.\nheadingPara: A paragraph explaining the chapter's topic.\nsubheadings: An array of 4 objects, each with:\nsubheading: Title of the subheading.\nsubheadingPara: Paragraph explaining the subheading with in 2 lines.\ncodeBlock: Relevant code in complete HTML styled with the following CSS (make sure it is readable and complete code related to it): background-color: #f3f4f6 padding: 1.5rem border-radius: 8px font-family: monospace font-size: 14px overflow-x: auto for horizontal scrolling width: 100% margin-bottom: 1.5rem\nEnsure clean, consistent, and engaging content. Use the provided chapter details:\n{\n\"chapterTitle\": \"Advanced Rendering Techniques and Optimization\",\n\"emoji\": \"✨\",\n\"chapterSummary\": \"This chapter explores advanced rendering techniques to achieve high-quality visuals and optimal performance in complex Three.js scenes.  Topics include shader programming, post-processing effects, and scene optimization strategies.\",\n\"topics\": [\n\"Advanced Shader Material Creation (using GLSL)\",\n\"Custom Shader Materials for Unique Visual Effects\",\n\"Post-Processing Effects (Bloom, SSAO, Depth of Field)\",\n\"Scene Optimization Techniques (Level of Detail, Occlusion Culling)\",\n\"Performance Profiling and Optimization Strategies\",\n\"Working with different renderers (WebGLRenderer, WebGPU)\",\n\"Implementation of deferred rendering or forward rendering\"\n]\n},"},
      ],
    },
    {
      role: "model",
      parts: [
        {text: "```json\n{\n  \"chapters\": {\n    \"heading\": \"Advanced Rendering Techniques and Optimization ✨\",\n    \"headingPara\": \"This chapter delves into the intricacies of advanced rendering techniques within Three.js, focusing on achieving both visually stunning and performant 3D scenes. We'll explore powerful methods like shader programming for creating unique materials, implementing post-processing effects to enhance realism, and employing strategic optimization techniques to maintain smooth frame rates even in complex scenarios.  This will cover various approaches, helping you tailor your rendering pipeline to your specific needs and hardware capabilities.\",\n    \"subheadings\": [\n      {\n        \"subheading\": \"Advanced Shader Material Creation (using GLSL)\",\n        \"subheadingPara\": \"Learn to craft custom materials using GLSL shaders, giving you unparalleled control over surface appearance.  This unlocks the ability to create realistic materials and unique visual effects not possible with standard Three.js materials.\",\n        \"codeBlock\": \"<div style=\\\"background-color: #f3f4f6; padding: 1.5rem; border-radius: 8px; font-family: monospace; font-size: 14px; overflow-x: auto; width: 100%; margin-bottom: 1.5rem;\\\">\\n  <pre>\\n    <code>\\n      // GLSL fragment shader\\n      void main() {\\n        vec3 color = vec3(1.0, 0.5, 0.2); // Orange color\\n        gl_FragColor = vec4(color, 1.0);\\n      }\\n    </code>\\n  </pre>\\n</div>\"\n      },\n      {\n        \"subheading\": \"Custom Shader Materials for Unique Visual Effects\",\n        \"subheadingPara\": \"Extend your creativity by designing shaders that produce unique visual styles. Explore techniques like cel-shading, stylized lighting, and procedural texture generation to create distinctive looks.\",\n        \"codeBlock\": \"<div style=\\\"background-color: #f3f4f6; padding: 1.5rem; border-radius: 8px; font-family: monospace; font-size: 14px; overflow-x: auto; width: 100%; margin-bottom: 1.5rem;\\\">\\n  <pre>\\n    <code>\\n      // GLSL vertex shader (example with displacement)\\n      varying vec3 vNormal;\\n      uniform float displacementStrength;\\n\\n      void main() {\\n        vec3 newPosition = position + normal * displacementStrength;\\n        gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);\\n        vNormal = normal;\\n      }\\n    </code>\\n  </pre>\\n</div>\"\n      },\n      {\n        \"subheading\": \"Post-Processing Effects (Bloom, SSAO, Depth of Field)\",\n        \"subheadingPara\": \"Enhance your scene's realism and visual appeal using post-processing effects. Implement bloom for glowing highlights, SSAO for ambient occlusion, and depth of field for cinematic focus.\",\n        \"codeBlock\": \"<div style=\\\"background-color: #f3f4f6; padding: 1.5rem; border-radius: 8px; font-family: monospace; font-size: 14px; overflow-x: auto; width: 100%; margin-bottom: 1.5rem;\\\">\\n  <pre>\\n    <code>\\n      //Conceptual example, actual implementation requires a post-processing framework\\n      // like three.js's postprocessing library.\\n      //This is a simplified illustration and not runnable code.\\n      Bloom bloomPass = new BloomPass();\\n      composer.addPass(bloomPass);\\n    </code>\\n  </pre>\\n</div>\"\n      },\n      {\n        \"subheading\": \"Scene Optimization Techniques (Level of Detail, Occlusion Culling)\",\n        \"subheadingPara\": \"Learn strategies to optimize complex scenes for improved performance. Explore techniques like Level of Detail (LOD) for efficient rendering of distant objects and occlusion culling to hide objects behind others.\",\n        \"codeBlock\": \"<div style=\\\"background-color: #f3f4f6; padding: 1.5rem; border-radius: 8px; font-family: monospace; font-size: 14px; overflow-x: auto; width: 100%; margin-bottom: 1.5rem;\\\">\\n  <pre>\\n    <code>\\n      //Conceptual example, actual implementation depends on the chosen library or method\\n      //This is a simplified illustration and not runnable code.\\n      scene.add(new LOD(meshHigh, meshLow, meshVeryLow));\\n      renderer.setClearColor(new Color(0x000000));\\n    </code>\\n  </pre>\\n</div>\"\n      }\n    ]\n  }\n}\n```\n"},
      ],
    },
  ],
  
});

export const generateFlashCardsAiModel = model.startChat({
  generationConfig,
  history: [
    {
      role: "user",
      parts: [
        { text: "Generate the flashcards on topic : Flutter Fundamentals, User Interface (UI) Development, Basic App Navigation in JSON format with front back content Maximum 15" },
      ],
    },
    {
      role: "model",
      parts: [
        { text: "```json\n[\n  {\n    \"front\": \"What is Flutter?\",\n    \"back\": \"Flutter is Google's UI toolkit for building natively compiled applications for mobile, web, and desktop from a single codebase.\"\n  },\n  {\n    \"front\": \"What is a Widget in Flutter?\",\n    \"back\": \"Everything in Flutter is a widget.  Widgets are the fundamental building blocks of a Flutter UI. They represent elements like text, buttons, images, etc.\"\n  },\n  {\n    \"front\": \"Explain the difference between StatelessWidget and StatefulWidget.\",\n    \"back\": \"StatelessWidget:  Its UI doesn't change after it's built.  StatefulWidget: Its UI can change in response to user interactions or other events.\"\n  },\n  {\n    \"front\": \"What is the purpose of the `BuildContext`?\",\n    \"back\": \"Provides access to information about the widget's position in the widget tree, allowing widgets to interact with the surrounding UI.\"\n  },\n  {\n    \"front\": \"How do you build a simple text widget in Flutter?\",\n    \"back\": \"```dart\\nText('Hello, Flutter!')\\n```\"\n  },\n  {\n    \"front\": \"Name three common layout widgets in Flutter.\",\n    \"back\": \"Row, Column, Stack\"\n  },\n  {\n    \"front\": \"What is the purpose of a `Container` widget?\",\n    \"back\": \"A Container widget provides a convenient way to apply styles like padding, margins, background color, and borders to its child widgets.\"\n  },\n  {\n    \"front\": \"How do you navigate to a new screen in Flutter?\",\n    \"back\": \"Using `Navigator.push()` with a `MaterialPageRoute`.\"\n  },\n  {\n    \"front\": \"What is a `MaterialApp` widget?\",\n    \"back\": \"The root widget for Material Design applications in Flutter. Provides features like app bar, theme, and navigation.\"\n  },\n  {\n    \"front\": \"What is the purpose of a `Scaffold` widget?\",\n    \"back\": \"Provides a basic visual layout structure for a Material Design app, including app bar, body, and floating action button.\"\n  },\n  {\n    \"front\": \"How do you pass data between screens using navigation?\",\n    \"back\": \"Use `arguments` in the `Route` object passed to `Navigator.push()` and access them in the next screen using `ModalRoute.of(context)?.settings.arguments`.\"\n  },\n  {\n    \"front\": \"Explain the difference between `push` and `pushReplacementNamed` navigation methods.\",\n    \"back\": \"`push` adds a new route to the navigation stack. `pushReplacementNamed` replaces the current route with the new one.\"\n  },\n  {\n    \"front\": \"How can you handle screen orientation changes in Flutter?\",\n    \"back\": \"By using `OrientationBuilder` or managing state to adapt the UI based on the current orientation.\"\n  },\n  {\n    \"front\": \"What are some common gesture detectors in Flutter?\",\n    \"back\": \"GestureDetector, InkWell, InkWell, LongPressDetector etc.\"\n  },\n  {\n    \"front\": \"How to use `setState()` in a StatefulWidget?\",\n    \"back\": \"Call `setState()` to rebuild the widget whenever the state changes.  This triggers a UI update.\"\n  }\n]\n```\n" },
      ],
    },
  ],
});

export const generateQuizAiModel = model.startChat({
  generationConfig,
  history: [
    {
      role: "user",
      parts: [
        {text: "Generate Quiz on topic: Flutter Fundamentals, User Interface (UI) Development, Basic App Navigation with Question and one word options along with correct answer in JSON format, (Max 10)\nFlutter Fundamentals, User Interface (UI) Development, Basic App Navigation"},
      ],
    },
    {
      role: "model",
      parts: [
        {text: "```json\n{\n  \"quiz\": [\n    {\n      \"question\": \"The primary programming language used in Flutter development?\",\n      \"options\": [\"Java\", \"Kotlin\", \"Dart\", \"Swift\"],\n      \"answer\": \"Dart\"\n    },\n    {\n      \"question\": \"Core building block of Flutter UI?\",\n      \"options\": [\"Widgets\", \"Fragments\", \"Activities\", \"Views\"],\n      \"answer\": \"Widgets\"\n    },\n    {\n      \"question\": \"Layout widget for arranging children in a column?\",\n      \"options\": [\"Row\", \"Column\", \"Stack\", \"Container\"],\n      \"answer\": \"Column\"\n    },\n    {\n      \"question\": \"Layout widget for arranging children horizontally?\",\n      \"options\": [\"Column\", \"Row\", \"Stack\", \"Container\"],\n      \"answer\": \"Row\"\n    },\n    {\n      \"question\": \"Widget used for flexible space distribution?\",\n      \"options\": [\"Expanded\", \"Flexible\", \"SizedBox\", \"Padding\"],\n      \"answer\": \"Expanded\"\n    },\n    {\n      \"question\": \"Widget for displaying text in Flutter?\",\n      \"options\": [\"Text\", \"Label\", \"Caption\", \"Paragraph\"],\n      \"answer\": \"Text\"\n    },\n    {\n      \"question\": \"Navigation method for pushing a new route onto the navigation stack?\",\n      \"options\": [\"pop\", \"push\", \"replace\", \"remove\"],\n      \"answer\": \"push\"\n    },\n    {\n      \"question\": \"Widget used to manage navigation in Flutter?\",\n      \"options\": [\"Navigator\", \"Route\", \"Controller\", \"Scaffold\"],\n      \"answer\": \"Navigator\"\n    },\n    {\n      \"question\": \"Widget that provides a basic visual structure for an app?\",\n      \"options\": [\"AppBar\", \"Center\", \"Container\", \"Scaffold\"],\n      \"answer\": \"Scaffold\"\n    },\n    {\n      \"question\": \"State management solution commonly used with Flutter?\",\n      \"options\": [\"Redux\", \"BLoC\", \"Provider\", \"All\"],\n      \"answer\": \"All\"\n    }\n  ]\n}\n```\n"},
      ],
    },
  ],
});

export const generateQaAiModel = model.startChat({
  generationConfig,
  history: [
    {
      role: "user",
      parts: [
        {text: "Generate Question answers on topic: Flutter fundaments, Basic app navigation, UI interface Development. The result should have an array of object with \"question\" and \"answer\" field as key value pair in each object. All the result in JSON format, (Max 10)"},
      ],
    },
    {
      role: "model",
      parts: [
        {text: "```json\n[\n  {\n    \"question\": \"What is Flutter?\",\n    \"answer\": \"Flutter is Google's UI toolkit for building natively compiled applications for mobile, web, and desktop from a single codebase.  It uses the Dart programming language and a reactive framework to build visually appealing and performant apps.\"\n  },\n  {\n    \"question\": \"What are Widgets in Flutter?\",\n    \"answer\": \"Widgets are the fundamental building blocks of Flutter UIs. Everything you see on the screen is a widget, from buttons and text to layouts and even the overall app structure. Widgets are immutable; changes are reflected by replacing old widgets with new ones.\"\n  },\n  {\n    \"question\": \"Explain the difference between StatelessWidget and StatefulWidget in Flutter.\",\n    \"answer\": \"StatelessWidget represents a part of the UI that does not change over time.  StatefulWidget represents a part of the UI that can change in response to user interactions or other events. It maintains state internally.\"\n  },\n  {\n    \"question\": \"How does basic navigation work in Flutter?\",\n    \"answer\": \"Basic navigation in Flutter typically involves using the `Navigator` widget.  You push new routes (screens) onto a navigation stack using `Navigator.push` and pop routes off the stack using `Navigator.pop`.  Routes are usually defined using MaterialPageRoute or CupertinoPageRoute.\"\n  },\n  {\n    \"question\": \"What is the role of MaterialApp and CupertinoApp in Flutter?\",\n    \"answer\": \"MaterialApp provides a Material Design-based scaffold for your application, including app bar, themes, and other Material Design components. CupertinoApp provides a similar scaffold, but based on Apple's Cupertino (iOS) design language.\"\n  },\n  {\n    \"question\": \"How do you pass data between screens in Flutter navigation?\",\n    \"answer\": \"You can pass data using the `arguments` parameter of `Navigator.push`.  You pass data as an argument to the `MaterialPageRoute` (or similar) and then access it in the destination screen using `ModalRoute.of(context).settings.arguments`.\"\n  },\n  {\n    \"question\": \"Name three common layout widgets in Flutter.\",\n    \"answer\": \"Three common layout widgets are `Row` (arranges children horizontally), `Column` (arranges children vertically), and `Stack` (overlays children on top of each other).\"\n  },\n  {\n    \"question\": \"What is a `BuildContext` in Flutter?\",\n    \"answer\": \"BuildContext is an object that provides information about the location of a widget in the widget tree. It's essential for accessing context-dependent information like themes, localization, and navigation.\"\n  },\n  {\n    \"question\": \"What are some common ways to manage state in Flutter?\",\n    \"answer\": \"Common state management techniques include using `setState` (for simple state changes within a StatefulWidget), `Provider`, `Riverpod`, `BLoC`, `GetX`, and `Redux` (for more complex state management in larger applications).\"\n  },\n  {\n    \"question\": \"How can you create responsive UI layouts in Flutter?\",\n    \"answer\": \"Flutter offers several mechanisms for creating responsive UI layouts. These include using `LayoutBuilder`, `MediaQuery` to access screen dimensions and orientation, and utilizing flexible layout widgets like `Expanded` and `Flexible` to adapt to different screen sizes.\"\n  }\n]\n```\n"},
      ],
    },
  ],
});


const result = await courseOutlineAIModel.sendMessage("INSERT_INPUT_HERE");
console.log(result.response.text());