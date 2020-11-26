  
export class TwitterPoint2D {
    constructor(public twitterName: string, public x: number, public y: number) {}
}

export class TwitterPoint3D {
    constructor(public twitterName: string, public x: number, public y: number, public z: number) {}
}

export class TwitterUser {
    constructor(public twitterName: string, public party: string, public coalition: string) {}
}