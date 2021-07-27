// etc
import Alert from "@material-ui/core/Alert";
import Box from "@material-ui/core/Box";
import LinearProgress from "@material-ui/core/LinearProgress";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Stack from "@material-ui/core/Stack";
import ContentCopyIcon from "@material-ui/icons/ContentCopy";
import ContentCutIcon from "@material-ui/icons/ContentCut";
import ContentPasteIcon from "@material-ui/icons/ContentPaste";
import Ajv from "ajv";
import { EditingRichMenuContext } from "contexts/EditingRichMenuContext";
import { JSONEditorContext } from "contexts/JSONEditorContext";
import * as monacoEditor from "monaco-editor/esm/vs/editor/editor.api";
import { ThemeColorContext } from "pages/_app";
import richMenuSchema from "public/schemas/richmenu.json";
import React, { useContext, useEffect, useRef, useState } from "react";


export default function JSONEditor(): JSX.Element {
  const { editorMode, systemMode } = useContext(ThemeColorContext);
  const { setters } = useContext(EditingRichMenuContext);
  const { jsonEditorValue, setJSONEditorValue } = useContext(JSONEditorContext);
  const monacoRef = useRef<monacoEditor.editor.IStandaloneCodeEditor>(null);
  const [isJSONValid, setIsJSONValid] = useState(true);
  const [isMonacoLoading, setIsMonacoLoading] = useState(true);
  const [isCopyAvailable, setisCopyAvailable] = useState(false);

  const editorElementRef = useRef<HTMLDivElement>();

  const [contextMenu, setContextMenu] = useState<{
    mouseX: number;
    mouseY: number;
  } | null>(null);

  useEffect(() => {
    if (!editorElementRef.current) return;
    let windowResizeListener;
    let monacoCreateListener;
    let monacoChangeModelListener;
    let monacoSelectListener;
    import("monaco-editor/esm/vs/editor/editor.api").then(monaco => {
      try {
        if (isMonacoLoading) {
          monacoCreateListener = monaco.editor.onDidCreateEditor((editor: monacoEditor.editor.IStandaloneCodeEditor) => {
            monacoRef.current = editor;
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            window.MonacoEnvironment.getWorkerUrl = (
              _moduleId: string,
              label: string
            ) => {
              if (label === "json") { return "_next/static/json.worker.js"; }
              return "_next/static/editor.worker.js";
            };
            windowResizeListener = () => editor.layout();
            window.addEventListener("resize", windowResizeListener);
            setIsMonacoLoading(false);
            monacoRef.current.setValue(jsonEditorValue);
            monacoChangeModelListener = editor.onDidChangeModelContent(() => setJSONEditorValue(monacoRef.current.getValue()));
          });
          monaco.editor.create(editorElementRef.current, {
            value: jsonEditorValue,
            language: "json",
            theme: { light: "vs", dark: "vs-dark" }[editorMode === "system" ? systemMode : editorMode],
            contextmenu: false
          });

          monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
            schemaValidation: "error",
            validate: true,
            schemas: [{
              uri: "https://richmenu.app.e-chan.cf/schemas/richmenu.json",
              fileMatch: ["*"],
              schema: richMenuSchema
            }]
          });

          monacoSelectListener = () => {
            setisCopyAvailable(Boolean(monacoRef.current.getModel().getValueInRange(monacoRef.current.getSelection())));
          };
          editorElementRef.current.addEventListener("keydown", monacoSelectListener);
          editorElementRef.current.addEventListener("mouseup", monacoSelectListener);
        }
      } catch (_) {
        console.error(_);
      }
    });
    return function cleanup() {
      window.removeEventListener("resize", windowResizeListener);
      editorElementRef.current?.removeEventListener("keydown", monacoSelectListener);
      editorElementRef.current?.removeEventListener("mouseup", monacoSelectListener);
      monacoCreateListener?.dispose?.();
      monacoChangeModelListener?.dispose();
      monacoRef.current?.getModel?.()?.dispose?.();
      monacoRef.current?.dispose?.();
      monacoRef.current = null;
    };
  }, [editorElementRef]);

  useEffect(() => {
    if (monacoRef.current) monacoRef.current.setValue(jsonEditorValue);
    let jsonEditorValueAsObject;
    try {
      jsonEditorValueAsObject = JSON.parse(jsonEditorValue);
    } catch (_) {
      setIsJSONValid(false);
      return;
    }
    const isJSONValid = new Ajv().compile(richMenuSchema)(jsonEditorValueAsObject);
    setIsJSONValid(isJSONValid);

    if (isJSONValid) {
      Object.entries(jsonEditorValueAsObject).forEach(([key, value]) => {
        setters[`set${key.slice(0, 1).toUpperCase()}${key.slice(1)}`](value);
      });
    }
  }, [jsonEditorValue]);

  useEffect(() => {
    if (monacoRef.current) monacoRef.current.updateOptions({ theme: { light: "vs", dark: "vs-dark" }[editorMode === "system" ? systemMode : editorMode] });
  }, [editorMode, systemMode]);

  const handleContextMenu = (event: React.MouseEvent) => {
    const findTarget = (target: HTMLElement) => {
      if (target.dataset.target) return target.dataset.target;
      if (target.parentElement) {
        if (target.parentElement.classList.contains("MuiCollapse-vertical")) return findTarget(target.parentElement);
        return findTarget(target.parentElement);
      }
      return null;
    };
    const target = findTarget(event.target as HTMLElement);
    if (!(target || (event.target as HTMLElement).classList.contains("MuiBackdrop-root"))) return;
    event.preventDefault();
    setContextMenu(
      contextMenu === null ? {
        mouseX: event.clientX - 2,
        mouseY: event.clientY - 4
      } : null
    );
  };

  const pasteText = async () => {
    const selection = monacoRef.current.getSelection();
    const text = await navigator.clipboard.readText();
    monacoRef.current.executeEdits("my-source", [{ range: selection, text: text, forceMoveMarkers: true }]);
    monacoRef.current.trigger("anyString", "editor.action.formatDocument", null);
  };

  const copyText = async (cut = false) => {
    const selection = monacoRef.current.getSelection();
    const text = monacoRef.current.getModel().getValueInRange(selection);
    await navigator.clipboard.writeText(text);
    if (cut) monacoRef.current.executeEdits("my-source", [{ range: selection, text: "", forceMoveMarkers: true }]);
    monacoRef.current.trigger("anyString", "editor.action.formatDocument", null);
  };

  return (
    <div style={{ height: "100%" }} onContextMenu={handleContextMenu}>
      <Stack direction="column" sx={{ height: "100%" }} >
        {isMonacoLoading && <LinearProgress/>}
        <Box sx={{ flex: 1 }} data-target="test">
          {/* <MonacoEditor
            editorDidMount={editorDidMount}
            editorWillMount={editorWillMount}
            width="100%"
            language="json"
            theme={(editorMode === "system" ? systemMode : editorMode) === "dark" ? "vs-dark" : "vs"}
            value={jsonEditorValue}
            onChange={value => setJSONEditorValue(value)}
            options={{
              contextmenu: false,
              formatOnPaste: true
            }}
          /> */}
          <div ref={editorElementRef} style={{ height: "100%" }} />
        </Box>
        {isMonacoLoading && (
          <Alert severity="info">JSONエディタを読み込んでいます...</Alert>
        )}
        { !isMonacoLoading && (isJSONValid ? (
          <Alert severity="success">正しい形式のJSONファイルです。</Alert>
        ) : (
          <Alert severity="error">不正な形式のJSONファイルです。内容を確認してください。</Alert>
        ))}
      </Stack>
      <Menu
        open={contextMenu !== null}
        onClose={() => setContextMenu(null)}
        anchorReference="anchorPosition"
        anchorPosition={
          contextMenu !== null? { top: contextMenu.mouseY, left: contextMenu.mouseX }: null
        }
      >
        {isCopyAvailable && (<>
          <MenuItem onClick={() => { copyText(true); setContextMenu(null); }}>
            <ListItemIcon>
              <ContentCutIcon />
            </ListItemIcon>
            <ListItemText>切り取り</ListItemText>
          </MenuItem>
          <MenuItem onClick={() => { copyText(); setContextMenu(null); }}>
            <ListItemIcon>
              <ContentCopyIcon />
            </ListItemIcon>
            <ListItemText>コピー</ListItemText>
          </MenuItem>
        </>
        )}
        <MenuItem onClick={() => { pasteText(); setContextMenu(null); }}>
          <ListItemIcon>
            <ContentPasteIcon />
          </ListItemIcon>
          <ListItemText>貼り付け</ListItemText>
        </MenuItem>
      </Menu>
    </div>);
}
