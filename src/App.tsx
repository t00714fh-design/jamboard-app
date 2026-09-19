import { useRef } from 'react'
import { Tldraw, Editor, getSnapshot, loadSnapshot } from 'tldraw'
import 'tldraw/tldraw.css'
import { db } from './firebase'
import { ref, onValue, set } from 'firebase/database'

export default function App() {
  const editorRef = useRef<Editor | null>(null)

  const handleMount = (editor: Editor) => {
    editorRef.current = editor

    const boardRef = ref(db, 'boards/default')
    let isImporting = false

    // 1. Firebaseの変更を検知してローカルに反映
    const unsubscribe = onValue(boardRef, (snapshot) => {
      const data = snapshot.val()
      if (data && editorRef.current) {
        isImporting = true
        try {
          // 文字列からオブジェクトに復元して読み込み
          const parsedData = typeof data === 'string' ? JSON.parse(data) : data
          loadSnapshot(editorRef.current.store, parsedData)
        } catch (e) {
          console.error("データの読み込みエラー:", e)
        } finally {
          isImporting = false
        }
      }
    })

    // 2. ローカルの変更を検知してFirebaseへ送信
    const cleanupListen = editor.store.listen(
      () => {
        if (isImporting) return

        try {
          const snapshot = getSnapshot(editor.store)
          // Firebaseの記号エラーを回避するためJSON文字列化して保存
          const jsonString = JSON.stringify(snapshot)
          set(boardRef, jsonString).catch((err) => {
            console.error("Firebase保存エラー:", err)
          })
        } catch (e) {
          console.error("Snapshot作成エラー:", e)
        }
      },
      { scope: 'document', source: 'user' }
    )

    return () => {
      unsubscribe()
      cleanupListen()
    }
  }

  return (
    <div style={{ position: 'fixed', inset: 0 }}>
      <Tldraw onMount={handleMount} />
    </div>
  )
}