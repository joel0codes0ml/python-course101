import Editor from "@monaco-editor/react";

export default function CodeEditor({ language }) {
  return (
    <Editor
      height="100%"
      theme="vs-dark"
      language={language}
      defaultValue="// Write your code here"
      options={{
        fontSize: 14,
        minimap: { enabled: false }
      }}
    />
  );
}
