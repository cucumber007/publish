import { CSSProperties } from 'react'

export const styles = {
  root: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: '#1a1a1a'
  } as CSSProperties,

  container: {
    width: '100vw',
    height: '100vh',
    background: '#ffffff',
    border: '10px solid #333',
    boxSizing: 'border-box',
    position: 'relative'
  } as CSSProperties,

  canvas: {
    width: '100%',
    height: '100%',
    display: 'block'
  } as CSSProperties,

  dock: {
    position: 'absolute',
    right: '20px',
    top: '50%',
    transform: 'translateY(-50%)',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    background: 'rgba(255, 255, 255, 0.9)',
    padding: '10px',
    borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
  } as CSSProperties,

  button: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    border: 'none',
    color: 'white',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background 0.2s'
  } as CSSProperties,

  nextTickButton: {
    background: '#2196f3'
  } as CSSProperties,

  resetButton: {
    background: '#f44336'
  } as CSSProperties,

  buttonHover: {
    nextTick: '#1976d2' as const,
    reset: '#d32f2f' as const
  }
} 