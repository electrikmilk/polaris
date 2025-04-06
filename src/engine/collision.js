/*
 * Algorithms for object collision.
 */

export function colliding(object1, object2) {
    if (object1.shape === 'circle' && object2.shape === 'circle') {
        return circleCollision(object1, object2);
    } else if (object1.shape === 'rectangle' && object2.shape === 'rectangle') {
        return boxCollision(object1, object2) === true;
    } else if (object1.shape === 'rectangle' && object2.shape === 'circle') {
        return circleBoxCollision(object2, object1) === true;
    } else if (object1.shape === 'circle' && object2.shape === 'rectangle') {
        return circleBoxCollision(object1, object2) === true;
    }
}

export function circleCollision(object1, object2) {
    let x_distance = object2.x - object1.x;
    let y_distance = object2.y - object1.y;
    return Math.sqrt(Math.pow(x_distance, 2) + Math.pow(y_distance, 2)) < (object1.radius || object2.radius);
}

export function boxCollision(object1, object2) {
    if (
            object1.x + object1.width >= object2.x &&
            object1.x <= object2.x + object2.width &&
            object1.y + object1.height >= object2.y &&
            object1.y <= object2.y + object2.height
    )
        return true;
}

export function circleBoxCollision(circle, box) {
    const circleDistance = {
        x: Math.abs(circle.x - box.x - circle.radius + 25),
        y: Math.abs(circle.y - box.y - circle.radius + 25),
    };
    if (circleDistance.x > (box.width / 2 + circle.radius)) {
        return false;
    }
    if (circleDistance.y > (box.height / 2 + circle.radius)) {
        return false;
    }
    if (circleDistance.x <= (box.width / 2)) {
        return true;
    }
    if (circleDistance.y <= (box.height / 2)) {
        return true;
    }
    const cornerDistance_sq = (circleDistance.x - box.width / 2) ^ 2 + (circleDistance.y - box.height / 2) ^ 2;
    return (cornerDistance_sq <= (circle.radius ^ 2));
}
