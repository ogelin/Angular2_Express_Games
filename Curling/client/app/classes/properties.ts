export let RINK_URL = '/assets/models/json/rink.json';
export let BLUE_STONE_URL = '/assets/models/json/blue_stone.json';
export let RED_STONE_URL = '/assets/models/json/red_stone.json';
export let BROOM_URL = '/assets/models/broom.dae';
export let STONE_COLLISION_URL = '/assets/effects/stoneHit.mp3';
export let RED_SPRITE_URL = '/assets/images/stoneRed.png';
export let BLUE_SPRITE_URL = '/assets/images/stoneBlue.png';
export let SPIN_CLOCKWISE_URL = '/assets/images/spin_H.png';
export let SPIN_ANTI_CLOCKWISE_URL = '/assets/images/spin_A.png';
export let RED_SPRITE = 'stoneRed';
export let BLUE_SPRITE = 'stoneBlue';
export let BLUE_STONE = 'blue_stone';
export let RED_STONE = 'red_stone';
export let BROOM = 'broom';
export let RINK_CURLING = 'rink';
export let SPIN_CLOCKWISE = 'spin_H';
export let SPIN_ANTI_CLOCKWISE = 'spin_A';
export let BROOM_SOUND_URL = '/assets/effects/broomSound.mp3';


export enum BROOM_OFFSIDE {
    HOG_LINE = 225,
    BACK_LINE = -420,
    LEFT = -84,
    RIGHT = 84,
}

export enum MOUSE {
    POS_X = 15,
}


export enum SPEED {
    MIN = 15,
}

export enum TOUR {
    NUMB = 40,
}

export enum SCENE {
    LIMIT_X = 92
}

export enum SKYBOX {
    LENGTH = 6,
}

export enum LIGHT {
    POS_X = -20,
    POS_Y = 30,
    POS_Z = 20,
}

export enum SWEEPING {
    HOG_LINE = 150,
    BACK_LINE = -430,
    LIMIT_SCENE = -460,
    LIMIT_Z = -390
}

export enum PHYSICS {
    FRICTION_START = 2,
    FRICTION_GRAP = 3,
}

export enum RINK {
    POS_X = 0,
    POS_Y = -15,
    POS_Z = 0,
    SCALE = 30,
}

export enum STONE {
    SCALE = 0.125,
    ANGLE = -1.5708,

    POS_X = 0,
    POS_Y = -15,
    POS_Z = 340,
    BLUE = 0,
    RED = 1,
    DIAMETER = 18,
    RADIUS = 9,
    NB_MAX = 16
}

export enum CAMERA {
    FRONT = 0,
    TOP = 1,
    FAR = 20000,
    NEAR = 1,
    FOV = 60,
    PERSPEC_X = 3.5538288883916866,
    PERSPEC_Y = 120,
    PERSPEC_Z = 550,
    ROT_ANGLE_Y = 1.5708,
    ROT_ANGLE_Z = 1.5708,
    ORTHO_Y = 150,
    POS_END = -100,
}

export enum VIEWING {
    NEAR = 0,
    FAR = 30,
}

export enum POSITION {
    X = 800,
    Y = 370,
    POS_X = 200,
    POS_Y = 20,
}

export enum SPRITE {
    DISTANCE_STONE = 40,
    BLUE_POS = 40,
    RED_POS = 40,
    BLUE = 1,
    RED = 0,
    NB_STONE = 8,
}

export enum EVENT {
    BUTTON_C = 67,
    SHIFT = 16,
    SPACE = 32,
    MOUSE_LEFT_BUTTON_CLICK = 0
}

export enum ROUND {
    NB_ROUND = 3,
    NB_SHOT = 48,
}

export enum LINE {
    RADIUS = 0.261799, //radius in radian
    RADIUS_INC = 0.0174533, // radius in radian
    LENGTH = 850,
    OFFSET = 15,
}

export enum VIRTUAL_PLAYER {
    NORMAL_SPEED_MIN = 80,
    NORMAL_SPEED_MAX = 90,
    NORMAL_RADIUS_MIN = -5,
    NORMAL_RADIUS_MAX = 5,

    DIFFICULT_SPEED_MIN = 85,
    DIFFICULT_SPEED_MAX = 87,
    DIFFICULT_RADIUS_MIN = -2,
    DIFFICULT_RADIUS_MAX = 2
}
