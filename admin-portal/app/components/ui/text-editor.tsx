import * as React from 'react';
import { LexicalComposer, type InitialConfigType } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $generateHtmlFromNodes, $generateNodesFromDOM } from '@lexical/html';
import { ListNode, ListItemNode } from '@lexical/list';
import { HeadingNode } from '@lexical/rich-text';
import {
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  REMOVE_LIST_COMMAND
} from '@lexical/list';
import {
  type EditorState,
  type LexicalEditor,
  FORMAT_TEXT_COMMAND,
  FORMAT_ELEMENT_COMMAND,
  $getRoot,
  $insertNodes,
  $getSelection,
  $isRangeSelection
} from 'lexical';
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Undo,
  Redo,
  List,
  ListOrdered
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface LexicalEditorHandle {
  setValue: (html: string) => void;
}

// Basic theme configuration with list styles
const theme = {
  heading: {
    h1: 'editor-heading-h1',
    h2: 'editor-heading-h2',
    h3: 'editor-heading-h3',
    h4: 'editor-heading-h4',
    h5: 'editor-heading-h5',
    h6: 'editor-heading-h6'
  },
  list: {
    listitem: 'editor-listitem',
    nested: {
      listitem: 'editor-nested-listitem'
    },
    ol: 'editor-list-ol',
    ul: 'editor-list-ul'
  }
};

// Inline styles for lists (for cross-platform compatibility)
const listStyles = `
  .editor-heading-h1 {
    font-size: 2em !important;
    font-weight: 700 !important;
    line-height: 1.2 !important;
    margin: 16px 0 8px 0 !important;
  }
  .editor-heading-h2 {
    font-size: 1.5em !important;
    font-weight: 700 !important;
    line-height: 1.25 !important;
    margin: 14px 0 6px 0 !important;
  }
  .editor-heading-h3 {
    font-size: 1.25em !important;
    font-weight: 600 !important;
    line-height: 1.3 !important;
    margin: 12px 0 4px 0 !important;
  }
  .editor-heading-h4 {
    font-size: 1.1em !important;
    font-weight: 600 !important;
    line-height: 1.35 !important;
    margin: 10px 0 4px 0 !important;
  }
  .editor-heading-h5 {
    font-size: 1em !important;
    font-weight: 600 !important;
    line-height: 1.4 !important;
    margin: 8px 0 2px 0 !important;
  }
  .editor-heading-h6 {
    font-size: 0.9em !important;
    font-weight: 600 !important;
    line-height: 1.4 !important;
    margin: 8px 0 2px 0 !important;
    text-transform: uppercase !important;
    letter-spacing: 0.025em !important;
  }
  .editor-list-ol {
    list-style-type: decimal !important;
    padding-left: 20px !important;
    margin: 8px 0 !important;
  }
  .editor-list-ul {
    list-style-type: disc !important;
    padding-left: 20px !important;
    margin: 8px 0 !important;
  }
  .editor-listitem {
    margin: 4px 0 !important;
  }
  .editor-nested-listitem {
    list-style-type: none !important;
  }
  
  /* Campaign content preview styles - match mobile app rendering */
  [data-slot="rich-text-editor"] h2 {
    font-size: 20px !important;
    font-weight: 700 !important;
    margin-bottom: 8px !important;
    margin-top: 0 !important;
  }
  [data-slot="rich-text-editor"] h3 {
    font-size: 16px !important;
    font-weight: 600 !important;
    margin-top: 20px !important;
    margin-bottom: 6px !important;
  }
  [data-slot="rich-text-editor"] p {
    margin: 8px 0 !important;
  }
  [data-slot="rich-text-editor"] div {
    margin-bottom: 12px !important;
  }
  [data-slot="rich-text-editor"] ul {
    padding-left: 18px !important;
    margin: 6px 0 !important;
  }
  [data-slot="rich-text-editor"] li {
    margin-bottom: 6px !important;
  }
  [data-slot="rich-text-editor"] hr {
    margin: 20px 0 !important;
    border: none !important;
    border-top: 1px solid #e5e5e5 !important;
  }
  [data-slot="rich-text-editor"] .strong,
  [data-slot="rich-text-editor"] span.strong {
    font-weight: 600 !important;
    color: #000000 !important;
  }
`;

// Toolbar Button Component
function ToolbarButton({
  onClick,
  active,
  disabled,
  children,
  title
}: {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  title?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={cn(
        'inline-flex items-center justify-center p-2 rounded hover:bg-accent transition-colors',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        active && 'bg-accent text-accent-foreground'
      )}
    >
      {children}
    </button>
  );
}

// Toolbar Plugin Component
function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const [isBold, setIsBold] = React.useState(false);
  const [isItalic, setIsItalic] = React.useState(false);
  const [isUnderline, setIsUnderline] = React.useState(false);
  const [canUndo, setCanUndo] = React.useState(false);
  const [canRedo, setCanRedo] = React.useState(false);
  const [isBulletList, setIsBulletList] = React.useState(false);
  const [isNumberList, setIsNumberList] = React.useState(false);

  const updateToolbar = React.useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      setIsBold(selection.hasFormat('bold'));
      setIsItalic(selection.hasFormat('italic'));
      setIsUnderline(selection.hasFormat('underline'));

      // Check if we're in a list
      const anchorNode = selection.anchor.getNode();
      const element =
        anchorNode.getKey() === 'root' ? anchorNode : anchorNode.getTopLevelElementOrThrow();
      const elementDOM = editor.getElementByKey(element.getKey());

      if (elementDOM !== null) {
        setIsBulletList(elementDOM.tagName === 'UL');
        setIsNumberList(elementDOM.tagName === 'OL');
      }
    }
  }, [editor]);

  React.useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        updateToolbar();
      });
    });
  }, [editor, updateToolbar]);

  React.useEffect(() => {
    return editor.registerCommand(
      'CAN_UNDO_COMMAND' as any,
      (payload: boolean) => {
        setCanUndo(payload);
        return false;
      },
      1
    );
  }, [editor]);

  React.useEffect(() => {
    return editor.registerCommand(
      'CAN_REDO_COMMAND' as any,
      (payload: boolean) => {
        setCanRedo(payload);
        return false;
      },
      1
    );
  }, [editor]);

  return (
    <div className="flex items-center gap-1 p-2 border-b border-border bg-muted/30">
      <ToolbarButton
        onClick={() => editor.dispatchCommand('UNDO_COMMAND' as any, undefined)}
        disabled={!canUndo}
        title="Undo"
      >
        <Undo className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.dispatchCommand('REDO_COMMAND' as any, undefined)}
        disabled={!canRedo}
        title="Redo"
      >
        <Redo className="h-4 w-4" />
      </ToolbarButton>

      <div className="w-px h-6 bg-border mx-1" />

      <ToolbarButton
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')}
        active={isBold}
        title="Bold"
      >
        <Bold className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic')}
        active={isItalic}
        title="Italic"
      >
        <Italic className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline')}
        active={isUnderline}
        title="Underline"
      >
        <Underline className="h-4 w-4" />
      </ToolbarButton>

      <div className="w-px h-6 bg-border mx-1" />

      <ToolbarButton
        onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'left')}
        title="Align Left"
      >
        <AlignLeft className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'center')}
        title="Align Center"
      >
        <AlignCenter className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'right')}
        title="Align Right"
      >
        <AlignRight className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'justify')}
        title="Justify"
      >
        <AlignJustify className="h-4 w-4" />
      </ToolbarButton>

      <div className="w-px h-6 bg-border mx-1" />

      <ToolbarButton
        onClick={() => {
          if (isBulletList) {
            editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
          } else {
            editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
          }
        }}
        active={isBulletList}
        title="Bullet List"
      >
        <List className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => {
          if (isNumberList) {
            editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
          } else {
            editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
          }
        }}
        active={isNumberList}
        title="Numbered List"
      >
        <ListOrdered className="h-4 w-4" />
      </ToolbarButton>
    </div>
  );
}

// Initial Value Plugin
const InitialValuePlugin = React.forwardRef(
  ({ initialValue }: { initialValue?: string }, ref: React.Ref<LexicalEditorHandle>) => {
    const [editor] = useLexicalComposerContext();
    // const [isFirstRender, setIsFirstRender] = React.useState(true);

    React.useImperativeHandle(ref, () => ({
      setValue: (htmlString: string) => {
        editor.update(() => {
          const parser = new DOMParser();
          const dom = parser.parseFromString(htmlString, 'text/html');
          const nodes = $generateNodesFromDOM(editor, dom);

          $getRoot().clear();
          $getRoot().select();
          $insertNodes(nodes);
        });
      }
    }));

    // I remove the isFirstRender as it resets the content over the data fetching from api when update banner
    React.useEffect(() => {
      if (!initialValue) return;

      editor.update(() => {
        const parser = new DOMParser();
        const dom = parser.parseFromString(initialValue!, 'text/html');
        const nodes = $generateNodesFromDOM(editor, dom);

        $getRoot().clear();
        $getRoot().select();
        $insertNodes(nodes);
      });
    }, [editor, initialValue]);

    return null;
  }
);

interface RichTextEditorProps {
  className?: string;
  placeholder?: string;
  value?: string;
  onClick?: () => void;
  onChange?: (html: string, editorState: EditorState) => void;
  readOnly?: boolean;
  disabled?: boolean;
  'aria-invalid'?: boolean;
  showToolbar?: boolean;
}

const RichTextEditor = React.forwardRef(
  (
    {
      className,
      placeholder = 'Enter text...',
      value,
      onChange,
      disabled = false,
      readOnly = false,
      'aria-invalid': ariaInvalid,
      showToolbar = true,
      ...props
    }: RichTextEditorProps,
    ref: React.Ref<LexicalEditorHandle>
  ) => {
    const initialConfig: InitialConfigType = {
      namespace: 'RichTextEditor',
      theme,
      nodes: [ListNode, ListItemNode, HeadingNode],
      editable: !disabled && !readOnly,
      onError: (error: Error) => {
        console.error(error);
      }
    };

    const handleChange = React.useCallback(
      (editorState: EditorState, editor: LexicalEditor) => {
        if (onChange) {
          editorState.read(() => {
            let html = $generateHtmlFromNodes(editor, null);

            // Add inline styles to lists for cross-platform rendering
            html = html.replace(
              /<ol/g,
              '<ol style="list-style-type: decimal; padding-left: 20px; margin: 8px 0;"'
            );
            html = html.replace(
              /<ul/g,
              '<ul style="list-style-type: disc; padding-left: 20px; margin: 8px 0;"'
            );
            html = html.replace(/<li/g, '<li style="margin: 4px 0;"');
            html = html
              // Remove `<br>` when it is the only content between <p>...</p>
              .replace(/<p><br><\/p>/g, '<p></p>');

            onChange(html, editorState);
          });
        }
      },
      [onChange]
    );

    return (
      <LexicalComposer initialConfig={{ ...initialConfig }}>
        <style>{listStyles}</style>
        <div
          data-slot="rich-text-editor"
          className={cn(
            'border-input flex flex-col w-full min-w-0 rounded-md border bg-transparent shadow-xs transition-[color,box-shadow] overflow-hidden',
            'focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[3px]',
            'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
            disabled && 'pointer-events-none cursor-not-allowed opacity-50',
            className
          )}
          aria-invalid={ariaInvalid}
          {...props}
        >
          {showToolbar && <ToolbarPlugin />}
          <div className="relative flex-1">
            <RichTextPlugin
              contentEditable={
                <ContentEditable
                  className={cn(
                    'placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30',
                    'w-full min-h-30 px-3 py-2 text-base outline-none md:text-sm',
                    'prose prose-sm max-w-none'
                  )}
                />
              }
              placeholder={
                <div className="pointer-events-none absolute left-3 top-2 text-base text-muted-foreground md:text-sm">
                  {placeholder}
                </div>
              }
              ErrorBoundary={LexicalErrorBoundary}
            />
          </div>
          <HistoryPlugin />
          <ListPlugin />
          <InitialValuePlugin ref={ref} initialValue={value} />
          {onChange && <OnChangePlugin onChange={handleChange} />}
        </div>
      </LexicalComposer>
    );
  }
);

export { RichTextEditor };
export type { RichTextEditorProps };
