import { useState, useEffect, useCallback } from 'react';

export interface ARSessionState {
  isSupported: boolean;
  isActive: boolean;
  isLoading: boolean;
  error: string | null;
  session: XRSession | null;
  referenceSpace: XRReferenceSpace | null;
}

export function useARSession() {
  const [sessionState, setSessionState] = useState<ARSessionState>({
    isSupported: false,
    isActive: false,
    isLoading: false,
    error: null,
    session: null,
    referenceSpace: null,
  });

  // WebXR対応チェック
  useEffect(() => {
    const checkWebXRSupport = async () => {
      try {
        if ('xr' in navigator) {
          const isSupported = await navigator.xr?.isSessionSupported('immersive-ar');
          setSessionState(prev => ({
            ...prev,
            isSupported: isSupported || false,
          }));
        } else {
          setSessionState(prev => ({
            ...prev,
            isSupported: false,
            error: 'WebXRがサポートされていません',
          }));
        }
      } catch (error) {
        setSessionState(prev => ({
          ...prev,
          isSupported: false,
          error: 'WebXR対応チェックに失敗しました',
        }));
      }
    };

    checkWebXRSupport();
  }, []);

  // ARセッション開始
  const startARSession = useCallback(async () => {
    if (!sessionState.isSupported) {
      setSessionState(prev => ({
        ...prev,
        error: 'ARがサポートされていません',
      }));
      return false;
    }

    setSessionState(prev => ({
      ...prev,
      isLoading: true,
      error: null,
    }));

    try {
      // ARセッション要求
      const session = await navigator.xr?.requestSession('immersive-ar', {
        requiredFeatures: ['local'],
        optionalFeatures: ['hit-test', 'dom-overlay', 'anchors', 'plane-detection'],
        domOverlay: { root: document.body }
      });

      if (session) {
        // リファレンススペースの取得
        let referenceSpace: XRReferenceSpace | null = null;
        try {
          referenceSpace = await session.requestReferenceSpace('local');
        } catch (refSpaceError) {
          console.warn('Failed to get local reference space, trying viewer:', refSpaceError);
          try {
            referenceSpace = await session.requestReferenceSpace('viewer');
          } catch (viewerError) {
            console.error('Failed to get any reference space:', viewerError);
          }
        }

        setSessionState(prev => ({
          ...prev,
          isActive: true,
          isLoading: false,
          session,
          referenceSpace,
        }));

        // セッション終了時のハンドラー
        session.addEventListener('end', () => {
          setSessionState(prev => ({
            ...prev,
            isActive: false,
            session: null,
            referenceSpace: null,
          }));
        });

        // 可視性変更ハンドラー
        session.addEventListener('visibilitychange', () => {
          console.log('AR session visibility changed:', session.visibilityState);
        });

        console.log('AR session started successfully');
        return true;
      }
    } catch (error) {
      console.error('AR session start failed:', error);
      setSessionState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'ARセッションの開始に失敗しました',
      }));
    }

    return false;
  }, [sessionState.isSupported]);

  // ARセッション終了
  const endARSession = useCallback(() => {
    if (sessionState.session) {
      sessionState.session.end();
    }
    setSessionState(prev => ({
      ...prev,
      isActive: false,
      isLoading: false,
      session: null,
      referenceSpace: null,
    }));
  }, [sessionState.session]);

  return {
    ...sessionState,
    startARSession,
    endARSession,
  };
}