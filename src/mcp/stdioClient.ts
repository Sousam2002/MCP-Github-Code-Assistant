import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { Logger } from "../logging/logger.js";

export interface StdioServerConfig {
  command: string;
  args: string[];
  env?: Record<string, string>;
}

export class StdioMcpToolClient {
  private client?: Client;

  constructor(
    private readonly name: string,
    private readonly config: StdioServerConfig,
    private readonly logger: Logger
  ) {}

  async connect(): Promise<void> {
    if (this.client) {
      return;
    }

    const transport = new StdioClientTransport({
      command: this.config.command,
      args: this.config.args,
      env: this.config.env
    });

    this.client = new Client(
      {
        name: `mcp-github-code-assistant-${this.name}`,
        version: "0.1.0"
      },
      {
        capabilities: {}
      }
    );

    await this.client.connect(transport);
    this.logger.info("Connected to MCP server", { server: this.name });
  }

  async callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
    await this.connect();
    const result = await this.client!.callTool({
      name,
      arguments: args
    });

    return result.content;
  }
}
