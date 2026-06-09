import { useEffect, useRef, useState } from 'react'
import { Html5Qrcode } from 'html5-qrcode'
import styles from './QrScanner.module.css'

interface QrScannerProps {
  /** Appelé avec le contenu décodé du QR. */
  onResult: (text: string) => void
  onClose: () => void
}

const READER_ID = 'qr-reader'

export function QrScanner({ onResult, onClose }: QrScannerProps) {
  const [error, setError] = useState<string | null>(null)
  const scannerRef = useRef<Html5Qrcode | null>(null)

  useEffect(() => {
    const scanner = new Html5Qrcode(READER_ID)
    scannerRef.current = scanner
    let stopped = false

    scanner
      .start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 240, height: 240 } },
        (decodedText) => {
          if (stopped) return
          stopped = true
          // Arrête la caméra avant de remonter le résultat
          scanner.stop().catch(() => undefined)
          onResult(decodedText)
        },
        () => undefined, // erreurs de décodage par frame : ignorées
      )
      .catch(() => {
        setError(
          "Impossible d'accéder à la caméra. Vérifiez les autorisations ou saisissez le code manuellement.",
        )
      })

    return () => {
      // Nettoyage : arrête la caméra au démontage
      if (scanner.isScanning) {
        scanner.stop().catch(() => undefined)
      }
    }
  }, [onResult])

  return (
    <div className={styles.overlay}>
      <div className={styles.header}>
        <h2>Scanner un colis</h2>
        <button type="button" className={styles.close} aria-label="Fermer" onClick={onClose}>
          <i className="bi bi-x-lg" />
        </button>
      </div>

      {error ? (
        <div className={styles.error}>
          <i className="bi bi-camera-video-off" />
          <p>{error}</p>
        </div>
      ) : (
        <>
          <div id={READER_ID} className={styles.reader} />
          <div className={styles.hint}>Visez le QR code collé sur le colis</div>
        </>
      )}
    </div>
  )
}
