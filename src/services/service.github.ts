import { Octokit } from 'octokit';

export interface GitHubFile {
  path: string;
  type: 'blob' | 'tree';
  sha: string;
  size?: number;
  url?: string;
}

export class GitHubService {
  private octokit: Octokit;

  constructor(token?: string) {
    this.octokit = new Octokit({ auth: token });
  }

  /**
   * Parses a GitHub URL to extract owner and repo name.
   * Supports:
   * - https://github.com/owner/repo
   * - owner/repo
   */
  static parseUrl(url: string): { owner: string; repo: string } | null {
    const cleanUrl = url.replace(/\/$/, '');
    const parts = cleanUrl.split('/');
    
    if (parts.length >= 2) {
      const repo = parts.pop()!;
      const owner = parts.pop()!;
      return { owner, repo };
    }
    
    const simpleMatch = cleanUrl.match(/^([^/]+)\/([^/]+)$/);
    if (simpleMatch) {
      return { owner: simpleMatch[1], repo: simpleMatch[2] };
    }

    return null;
  }

  async getRepoTree(owner: string, repo: string, branch: string = 'main'): Promise<GitHubFile[]> {
    try {
      const { data } = await this.octokit.rest.git.getTree({
        owner,
        repo,
        tree_sha: branch,
        recursive: 'true',
      });
      return data.tree as GitHubFile[];
    } catch (error) {
      console.error('Error fetching repo tree:', error);
      throw error;
    }
  }

  async getFileContent(owner: string, repo: string, path: string): Promise<string> {
    try {
      const { data } = await this.octokit.rest.repos.getContent({
        owner,
        repo,
        path,
      });

      if ('content' in data && typeof data.content === 'string') {
        return Buffer.from(data.content, 'base64').toString('utf-8');
      }
      throw new Error('File content not found or is not a string');
    } catch (error) {
      console.error(`Error fetching file content for ${path}:`, error);
      throw error;
    }
  }
}
