
export class TwitterUser {
  constructor(
    public photo: string,
    public username: string,
    public firstname: string,
    public surname: string,
    public party: string,
    public coalition: string,
    public role: string,
    public tweetsCount: number,
    public x_graph2d: number,
    public y_graph2d: number,
    public x_graph3d: number,
    public y_graph3d: number,
    public z_graph3d: number,
    public cluster_dbscan_id: number,
    public cluster_kmeans_id: number,
    public cluster_pam_id: number
  ) {}
}

export interface Word {
  text: string,
  value: number
}
