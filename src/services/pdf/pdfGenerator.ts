import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system";
import { Note } from "@/features/notes/types/note";
import { Platform } from "react-native";

export const pdfGenerator = {
  async generateNotesPdf(note: Note) {
    const dateStr = new Date(note.createdAt).toLocaleDateString();

    // Convert Markdown to Simple HTML (Basic conversion for common elements)
    const htmlContent = this.markdownToHtml(note.content);

    const htmlTemplate = `
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
          <style>
            body {
              font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
              padding: 40px;
              color: #1e293b;
              line-height: 1.6;
            }
            .header {
              border-bottom: 2px solid #208aef;
              margin-bottom: 30px;
              padding-bottom: 20px;
              display: flex;
              justify-content: space-between;
              align-items: center;
            }
            .logo {
              color: #208aef;
              font-size: 24px;
              font-weight: bold;
            }
            .meta {
              text-align: right;
              color: #64748b;
              font-size: 12px;
            }
            h1 {
              color: #0f172a;
              font-size: 28px;
              margin-bottom: 10px;
            }
            h2 {
              color: #208aef;
              font-size: 20px;
              margin-top: 25px;
              border-left: 4px solid #208aef;
              padding-left: 10px;
            }
            .note-type {
              display: inline-block;
              background-color: #eff6ff;
              color: #208aef;
              padding: 4px 12px;
              border-radius: 20px;
              font-size: 10px;
              font-weight: bold;
              text-transform: uppercase;
              margin-bottom: 20px;
            }
            p { margin-bottom: 15px; }
            ul, ol { margin-bottom: 15px; padding-left: 20px; }
            li { margin-bottom: 5px; }
            strong { color: #0f172a; }
            .footer {
              margin-top: 50px;
              text-align: center;
              font-size: 10px;
              color: #94a3b8;
              border-top: 1px solid #f1f5f9;
              padding-top: 20px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">TopperAI</div>
            <div class="meta">
              Generated on ${dateStr}<br/>
              Source: ${note.source}
            </div>
          </div>

          <h1>${note.title}</h1>
          <div class="note-type">${note.type} Notes</div>

          <div class="content">
            ${htmlContent}
          </div>

          <div class="footer">
            Study Smarter with TopperAI • © 2026 TopperAI
          </div>
        </body>
      </html>
    `;

    try {
      const { uri } = await Print.printToFileAsync({ html: htmlTemplate });

      const fileName = `TopperAI_${note.title.replace(/[^a-z0-9]/gi, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
      const newUri = `${FileSystem.cacheDirectory}${fileName}`;

      await FileSystem.moveAsync({
        from: uri,
        to: newUri,
      });

      return newUri;
    } catch (error) {
      console.error("PDF Generation Error:", error);
      throw error;
    }
  },

  async sharePdf(uri: string) {
    if (Platform.OS === 'web') {
      alert("PDF download is coming soon to web. Please use the mobile app for now.");
      return;
    }

    if (!(await Sharing.isAvailableAsync())) {
      alert("Sharing is not available on your device");
      return;
    }

    await Sharing.shareAsync(uri, {
      mimeType: 'application/pdf',
      dialogTitle: 'Share TopperAI Notes',
      UTI: 'com.adobe.pdf',
    });
  },

  markdownToHtml(markdown: string) {
    // Very basic markdown to HTML conversion for common study note elements
    return markdown
      .replace(/^# (.*$)/gm, '<h1>$1</h1>')
      .replace(/^## (.*$)/gm, '<h2>$1</h2>')
      .replace(/^### (.*$)/gm, '<h3>$1</h3>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/^\- (.*$)/gm, '<li>$1</li>')
      .replace(/(<li>.*<\/li>)/gms, '<ul>$1</ul>')
      .replace(/\n\n/g, '</p><p>')
      .replace(/^/, '<p>')
      .replace(/$/, '</p>');
  }
};
