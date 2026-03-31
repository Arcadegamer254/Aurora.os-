import { VFSNode } from '../types';

const STORAGE_KEY = 'aurora_fs';

const DEFAULT_FS: VFSNode = {
  name: '/',
  type: 'dir',
  children: {
    'home': {
      name: 'home',
      type: 'dir',
      children: {
        'user': {
          name: 'user',
          type: 'dir',
          children: {
            'welcome.txt': { name: 'welcome.txt', type: 'file', content: 'Welcome to AuroraOS VFS!' },
            'Desktop': {
              name: 'Desktop',
              type: 'dir',
              children: {
                'notes.txt': { name: 'notes.txt', type: 'file', content: 'Welcome to AuroraOS!\n\nTry editing this file and saving it.' }
              }
            }
          }
        }
      }
    },
    'system': { name: 'system', type: 'dir', children: {} }
  }
};

export const getFS = (): VFSNode => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error('Failed to parse VFS', e);
    }
  }
  return DEFAULT_FS;
};

export const saveFS = (fs: VFSNode) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(fs));
  window.dispatchEvent(new Event('vfs-updated'));
};

export const readFile = (fs: VFSNode, path: string): string | null => {
  const node = resolvePath(fs, path);
  return node && node.type === 'file' ? (node.content || '') : null;
};

export const writeFile = (fs: VFSNode, path: string, content: string): VFSNode => {
  return touch(fs, path, content);
};

export const resolvePath = (fs: VFSNode, path: string): VFSNode | null => {
  const parts = path.split('/').filter(p => p);
  let curr: VFSNode = fs;
  for (const part of parts) {
    if (curr.type === 'dir' && curr.children && curr.children[part]) {
      curr = curr.children[part];
    } else {
      return null;
    }
  }
  return curr;
};

export const mkdir = (fs: VFSNode, path: string): VFSNode => {
  const parts = path.split('/').filter(p => p);
  const newFs = { ...fs };
  let curr = newFs;
  for (const part of parts) {
    if (!curr.children) curr.children = {};
    if (!curr.children[part]) {
      curr.children[part] = { name: part, type: 'dir', children: {} };
    }
    curr = curr.children[part];
  }
  saveFS(newFs);
  return newFs;
};

export const touch = (fs: VFSNode, path: string, content: string = ''): VFSNode => {
  const parts = path.split('/').filter(p => p);
  const fileName = parts.pop();
  if (!fileName) return fs;
  
  const newFs = { ...fs };
  let curr = newFs;
  for (const part of parts) {
    if (!curr.children) curr.children = {};
    if (!curr.children[part]) {
      curr.children[part] = { name: part, type: 'dir', children: {} };
    }
    curr = curr.children[part];
  }
  
  if (!curr.children) curr.children = {};
  curr.children[fileName] = { name: fileName, type: 'file', content };
  saveFS(newFs);
  return newFs;
};

export interface SearchResult {
  node: VFSNode;
  path: string;
}

export const searchVFS = (fs: VFSNode, query: string, currentPath: string = ''): SearchResult[] => {
  if (!query) return [];
  const results: SearchResult[] = [];
  const lowerQuery = query.toLowerCase();

  const traverse = (node: VFSNode, path: string) => {
    if (node.name.toLowerCase().includes(lowerQuery) && node.name !== '/') {
      results.push({ node, path });
    }

    if (node.type === 'dir' && node.children) {
      Object.entries(node.children).forEach(([name, child]) => {
        traverse(child, `${path === '/' ? '' : path}/${name}`);
      });
    }
  };

  traverse(fs, currentPath || '/');
  return results;
};
