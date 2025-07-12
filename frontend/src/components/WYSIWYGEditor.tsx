import React, { useRef, useCallback, useState, useEffect } from 'react';
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
  ListOrdered
} from 'lucide-react';

interface WYSIWYGEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: string;
}

export const WYSIWYGEditor: React.FC<WYSIWYGEditorProps> = ({ 
  value, 
  onChange, 
  placeholder = "Write your content here...",
  minHeight = "200px"
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [alignment, setAlignment] = useState<'left' | 'center' | 'right'>('left');

  // Update editor content when value prop changes
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  const handleInput = useCallback(() => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  }, [onChange]);

  const execCommand = useCallback((command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    handleInput();
  }, [handleInput]);

  const formatText = useCallback((format: string) => {
    switch (format) {
      case 'bold':
        execCommand('bold');
        break;
      case 'italic':
        execCommand('italic');
        break;
      case 'strikethrough':
        execCommand('strikeThrough');
        break;
      case 'underline':
        execCommand('underline');
        break;
      case 'code':
        // Toggle code formatting
        if (isCommandActive('formatBlock')) {
          execCommand('formatBlock', 'div');
        } else {
          execCommand('formatBlock', 'pre');
        }
        break;
      case 'quote':
        // Toggle quote formatting
        if (isCommandActive('formatBlock')) {
          execCommand('formatBlock', 'div');
        } else {
          execCommand('formatBlock', 'blockquote');
        }
        break;
      case 'list':
        execCommand('insertUnorderedList');
        break;
      case 'numbered-list':
        execCommand('insertOrderedList');
        break;
      case 'heading1':
        execCommand('formatBlock', 'h1');
        break;
      case 'heading2':
        execCommand('formatBlock', 'h2');
        break;
      case 'heading3':
        execCommand('formatBlock', 'h3');
        break;
    }
  }, [execCommand]);

  const handleAlignment = useCallback((align: 'left' | 'center' | 'right') => {
    setAlignment(align);
    switch (align) {
      case 'left':
        execCommand('justifyLeft');
        break;
      case 'center':
        execCommand('justifyCenter');
        break;
      case 'right':
        execCommand('justifyRight');
        break;
    }
  }, [execCommand]);

  const handleImageUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      execCommand('insertImage', imageUrl);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [execCommand]);

  const handleLinkInsert = useCallback(() => {
    if (linkUrl) {
      const selection = window.getSelection();
      const text = linkText || selection?.toString() || linkUrl;
      
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const link = document.createElement('a');
        link.href = linkUrl;
        link.textContent = text;
        link.style.color = '#1f0d38';
        link.style.textDecoration = 'underline';
        
        range.deleteContents();
        range.insertNode(link);
        selection.removeAllRanges();
      }
      
      setIsLinkModalOpen(false);
      setLinkUrl('');
      setLinkText('');
      handleInput();
    }
  }, [linkUrl, linkText, handleInput]);

  const insertEmoji = useCallback((emoji: string) => {
    execCommand('insertText', emoji);
    setShowEmojiPicker(false);
  }, [execCommand]);

  const isCommandActive = useCallback((command: string) => {
    try {
      return document.queryCommandState(command);
    } catch (e) {
      return false;
    }
  }, []);

  const toolbarButtons = [
    { icon: Bold, action: () => formatText('bold'), tooltip: 'Bold (Ctrl+B)', command: 'bold' },
    { icon: Italic, action: () => formatText('italic'), tooltip: 'Italic (Ctrl+I)', command: 'italic' },
    { icon: Strikethrough, action: () => formatText('strikethrough'), tooltip: 'Strikethrough', command: 'strikeThrough' },
    { icon: Code, action: () => formatText('code'), tooltip: 'Code Block', command: 'code' },
    { icon: Quote, action: () => formatText('quote'), tooltip: 'Quote', command: 'quote' },
  ];

  const listButtons = [
    { icon: List, action: () => formatText('list'), tooltip: 'Bullet List', command: 'insertUnorderedList' },
    { icon: ListOrdered, action: () => formatText('numbered-list'), tooltip: 'Numbered List', command: 'insertOrderedList' },
  ];

  const alignButtons = [
    { icon: AlignLeft, action: () => handleAlignment('left'), tooltip: 'Align Left', active: alignment === 'left' },
    { icon: AlignCenter, action: () => handleAlignment('center'), tooltip: 'Align Center', active: alignment === 'center' },
    { icon: AlignRight, action: () => handleAlignment('right'), tooltip: 'Align Right', active: alignment === 'right' },
  ];

  const emojis = ['😀', '😂', '😍', '🤔', '👍', '👎', '❤️', '🎉', '🔥', '💡', '✨', '🚀', '💻', '📝', '🎯'];

  // Handle paste to maintain formatting
  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    document.execCommand('insertText', false, text);
  }, []);

  // Handle key commands
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
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
        case 'u':
          e.preventDefault();
          formatText('underline');
          break;
      }
    }
  }, [formatText]);

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
                  isCommandActive(button.command)
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
                className={`p-2 rounded-lg transition-colors ${
                  isCommandActive(button.command)
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
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onPaste={handlePaste}
        onKeyDown={handleKeyDown}
        className="w-full px-6 py-4 border-2 border-t-0 border-gray-200 rounded-b-2xl focus:border-[#1f0d38] focus:outline-none transition-all duration-300 bg-white resize-none text-sm"
        style={{ minHeight }}
        data-placeholder={placeholder}
        suppressContentEditableWarning={true}
      />

      {/* Custom styles for the editor */}
      <style>{`
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: #9ca3af;
          pointer-events: none;
          font-style: italic;
        }
        
        [contenteditable] blockquote {
          border-left: 4px solid #1f0d38;
          padding-left: 16px;
          margin: 16px 0;
          color: #6b7280;
          font-style: italic;
        }
        
        [contenteditable] pre {
          background-color: #f3f4f6;
          padding: 12px;
          border-radius: 8px;
          font-family: 'Courier New', monospace;
          overflow-x: auto;
        }
        
        [contenteditable] ul {
          list-style-type: disc;
          padding-left: 40px;
          margin: 16px 0;
        }
        
        [contenteditable] ol {
          list-style-type: decimal;
          padding-left: 40px;
          margin: 16px 0;
        }
        
        [contenteditable] li {
          margin: 8px 0;
          display: list-item;
        }
        
        [contenteditable] ul li {
          list-style-type: disc;
        }
        
        [contenteditable] ol li {
          list-style-type: decimal;
        }
        
        [contenteditable] a {
          color: #1f0d38;
          text-decoration: underline;
        }
        
        [contenteditable] img {
          max-width: 100%;
          height: auto;
          border-radius: 8px;
          margin: 8px 0;
          display: block;
        }
        
        [contenteditable]:focus {
          outline: none;
        }
        
        [contenteditable] p {
          margin: 8px 0;
        }
        
        [contenteditable] h1, [contenteditable] h2, [contenteditable] h3 {
          font-weight: bold;
          margin: 16px 0 8px 0;
        }
        
        [contenteditable] h1 { font-size: 1.5em; }
        [contenteditable] h2 { font-size: 1.3em; }
        [contenteditable] h3 { font-size: 1.1em; }
      `}</style>

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
                  Link Text (optional)
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