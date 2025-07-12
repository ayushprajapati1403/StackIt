import React, { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  Bold, 
  Italic, 
  Strikethrough, 
  List, 
  Link, 
  Image, 
  AlignLeft, 
  AlignCenter, 
  AlignRight,
  Smile,
  Code,
  Quote,
  Undo,
  Redo
} from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({ 
  value, 
  onChange, 
  placeholder = "Write your content here...",
  rows = 8 
}) => {
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [alignment, setAlignment] = useState<'left' | 'center' | 'right'>('left');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getSelectedText = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) return { start: 0, end: 0, text: '' };
    
    return {
      start: textarea.selectionStart,
      end: textarea.selectionEnd,
      text: textarea.value.substring(textarea.selectionStart, textarea.selectionEnd)
    };
  }, []);

  const insertTextAtCursor = useCallback((before: string, after: string = '', replaceSelection: boolean = true) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const { start, end, text: selectedText } = getSelectedText();
    const beforeText = value.substring(0, start);
    const afterText = value.substring(end);
    
    let newText;
    let newCursorPos;

    if (replaceSelection && selectedText) {
      // Wrap selected text
      newText = beforeText + before + selectedText + after + afterText;
      newCursorPos = start + before.length + selectedText.length + after.length;
    } else {
      // Insert at cursor
      newText = beforeText + before + after + afterText;
      newCursorPos = start + before.length;
    }

    onChange(newText);
    
    // Restore cursor position
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  }, [value, onChange, getSelectedText]);

  const formatText = useCallback((format: string) => {
    const { text: selectedText } = getSelectedText();
    
    switch (format) {
      case 'bold':
        if (selectedText) {
          insertTextAtCursor('**', '**', true);
        } else {
          insertTextAtCursor('**bold text**', '', false);
        }
        break;
      case 'italic':
        if (selectedText) {
          insertTextAtCursor('*', '*', true);
        } else {
          insertTextAtCursor('*italic text*', '', false);
        }
        break;
      case 'strikethrough':
        if (selectedText) {
          insertTextAtCursor('~~', '~~', true);
        } else {
          insertTextAtCursor('~~strikethrough text~~', '', false);
        }
        break;
      case 'code':
        if (selectedText) {
          if (selectedText.includes('\n')) {
            insertTextAtCursor('```\n', '\n```', true);
          } else {
            insertTextAtCursor('`', '`', true);
          }
        } else {
          insertTextAtCursor('`code`', '', false);
        }
        break;
      case 'quote':
        if (selectedText) {
          const lines = selectedText.split('\n');
          const quotedLines = lines.map(line => `> ${line}`).join('\n');
          const { start, end } = getSelectedText();
          const beforeText = value.substring(0, start);
          const afterText = value.substring(end);
          onChange(beforeText + quotedLines + afterText);
        } else {
          insertTextAtCursor('> Quote text', '', false);
        }
        break;
      case 'list':
        insertTextAtCursor('- List item', '', false);
        break;
      case 'numbered-list':
        insertTextAtCursor('1. Numbered item', '', false);
        break;
    }
  }, [insertTextAtCursor, getSelectedText, value, onChange]);

  const handleAlignment = useCallback((align: 'left' | 'center' | 'right') => {
    setAlignment(align);
  }, []);

  const handleImageUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      insertTextAtCursor(`![${file.name}](${imageUrl})`, '', false);
    }
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [insertTextAtCursor]);

  const handleLinkInsert = useCallback(() => {
    if (linkUrl && linkText) {
      insertTextAtCursor(`[${linkText}](${linkUrl})`, '', false);
      setIsLinkModalOpen(false);
      setLinkUrl('');
      setLinkText('');
    }
  }, [linkUrl, linkText, insertTextAtCursor]);

  const insertEmoji = useCallback((emoji: string) => {
    insertTextAtCursor(emoji, '', false);
    setShowEmojiPicker(false);
  }, [insertTextAtCursor]);

  const toolbarButtons = [
    { icon: Bold, action: () => formatText('bold'), tooltip: 'Bold (Ctrl+B)', active: false },
    { icon: Italic, action: () => formatText('italic'), tooltip: 'Italic (Ctrl+I)', active: false },
    { icon: Strikethrough, action: () => formatText('strikethrough'), tooltip: 'Strikethrough', active: false },
    { icon: Code, action: () => formatText('code'), tooltip: 'Code', active: false },
    { icon: Quote, action: () => formatText('quote'), tooltip: 'Quote', active: false },
  ];

  const listButtons = [
    { icon: List, action: () => formatText('list'), tooltip: 'Bullet List' },
  ];

  const alignButtons = [
    { icon: AlignLeft, action: () => handleAlignment('left'), tooltip: 'Align Left', active: alignment === 'left' },
    { icon: AlignCenter, action: () => handleAlignment('center'), tooltip: 'Align Center', active: alignment === 'center' },
    { icon: AlignRight, action: () => handleAlignment('right'), tooltip: 'Align Right', active: alignment === 'right' },
  ];

  const emojis = ['😀', '😂', '😍', '🤔', '👍', '👎', '❤️', '🎉', '🔥', '💡', '✨', '🚀', '💻', '📝', '🎯'];

  const getTextAlign = () => {
    switch (alignment) {
      case 'center': return 'text-center';
      case 'right': return 'text-right';
      default: return 'text-left';
    }
  };

  return (
    <div className="relative">
      {/* Toolbar */}
      <div className="border-2 border-gray-200 rounded-t-2xl bg-gray-50 p-4">
        <div className="flex flex-wrap gap-2 items-center">
          {/* Text Formatting */}
          <div className="flex gap-1">
            {toolbarButtons.map((button, index) => (
              <motion.button
                key={index}
                onClick={button.action}
                className={`p-2 rounded-lg transition-colors group relative ${
                  button.active 
                    ? 'bg-[#1f0d38] text-white' 
                    : 'hover:bg-gray-200 text-gray-700'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title={button.tooltip}
                type="button"
              >
                <button.icon className="w-4 h-4" />
              </motion.button>
            ))}
          </div>

          <div className="w-px h-8 bg-gray-300 mx-2"></div>

          {/* Lists */}
          <div className="flex gap-1">
            {listButtons.map((button, index) => (
              <motion.button
                key={index}
                onClick={button.action}
                className="p-2 hover:bg-gray-200 rounded-lg transition-colors text-gray-700"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title={button.tooltip}
                type="button"
              >
                <button.icon className="w-4 h-4" />
              </motion.button>
            ))}
          </div>

          <div className="w-px h-8 bg-gray-300 mx-2"></div>

          {/* Link and Image */}
          <div className="flex gap-1">
            <motion.button
              onClick={() => setIsLinkModalOpen(true)}
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors text-gray-700"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title="Insert Link"
              type="button"
            >
              <Link className="w-4 h-4" />
            </motion.button>
            <motion.button
              onClick={() => fileInputRef.current?.click()}
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors text-gray-700"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title="Insert Image"
              type="button"
            >
              <Image className="w-4 h-4" />
            </motion.button>
          </div>

          <div className="w-px h-8 bg-gray-300 mx-2"></div>

          {/* Alignment */}
          <div className="flex gap-1">
            {alignButtons.map((button, index) => (
              <motion.button
                key={index}
                onClick={button.action}
                className={`p-2 rounded-lg transition-colors ${
                  button.active 
                    ? 'bg-[#1f0d38] text-white' 
                    : 'hover:bg-gray-200 text-gray-700'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title={button.tooltip}
                type="button"
              >
                <button.icon className="w-4 h-4" />
              </motion.button>
            ))}
          </div>

          <div className="w-px h-8 bg-gray-300 mx-2"></div>

          {/* Emojis */}
          <div className="flex gap-1">
            <div className="relative">
              <motion.button
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="p-2 hover:bg-gray-200 rounded-lg transition-colors text-gray-700"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title="Insert Emoji"
                type="button"
              >
                <Smile className="w-4 h-4" />
              </motion.button>
              {showEmojiPicker && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute top-full left-0 mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-lg p-3 z-10"
                >
                  <div className="grid grid-cols-5 gap-2 max-w-xs">
                    {emojis.map((emoji, index) => (
                      <button
                        key={index}
                        onClick={() => insertEmoji(emoji)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-lg"
                        type="button"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Editor Content */}
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full px-6 py-4 border-2 border-t-0 border-gray-200 rounded-b-2xl focus:border-[#1f0d38] focus:outline-none transition-all duration-300 bg-white resize-none font-mono text-sm ${getTextAlign()}`}
        rows={rows}
        onKeyDown={(e) => {
          if (e.ctrlKey || e.metaKey) {
            switch (e.key) {
              case 'b':
                e.preventDefault();
                formatText('bold');
                break;
              case 'i':
                e.preventDefault();
                formatText('italic');
                break;
            }
          }
        }}
      />

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />

      {/* Link Modal */}
      {isLinkModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setIsLinkModalOpen(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl p-6 w-full max-w-md mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold mb-4">Insert Link</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Link Text
                </label>
                <input
                  type="text"
                  value={linkText}
                  onChange={(e) => setLinkText(e.target.value)}
                  placeholder="Enter link text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1f0d38] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URL
                </label>
                <input
                  type="url"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1f0d38] focus:border-transparent"
                />
              </div>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setIsLinkModalOpen(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  type="button"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLinkInsert}
                  className="px-4 py-2 bg-[#1f0d38] text-white rounded-lg hover:bg-[#2d1b4e] transition-colors"
                  type="button"
                >
                  Insert Link
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Click outside to close emoji picker */}
      {showEmojiPicker && (
        <div 
          className="fixed inset-0 z-5" 
          onClick={() => setShowEmojiPicker(false)}
        />
      )}
    </div>
  );
};