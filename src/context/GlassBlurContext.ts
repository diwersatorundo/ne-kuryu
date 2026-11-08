import { ComponentRef, createContext, RefObject, useContext } from 'react';
import { View } from 'react-native';

export type GlassBlurTarget = RefObject<ComponentRef<typeof View> | null>;

const GlassBlurContext = createContext<GlassBlurTarget | null>(null);

export const GlassBlurProvider = GlassBlurContext.Provider;

export function useGlassBlurTarget(): GlassBlurTarget | null {
  return useContext(GlassBlurContext);
}
