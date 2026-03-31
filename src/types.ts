import React from 'react';

export type FileType = 'file' | 'dir';

export interface VFSNode {
  name: string;
  type: FileType;
  content?: string;
  children?: Record<string, VFSNode>;
}

export interface AppConfig {
  id: string;
  name: string;
  icon: string;
  component: React.ComponentType<any>;
}

export interface WindowState {
  id: string;
  appId: string;
  title: string;
  zIndex: number;
  isMinimized: boolean;
  isMaximized: boolean;
  position: { x: number; y: number };
  size: { width: number; height: number };
  props?: Record<string, any>;
}
