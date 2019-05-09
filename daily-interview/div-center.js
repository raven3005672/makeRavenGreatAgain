<div class="parent">
    <div class="child"></div>
</div>

// 1.
div.parent {
    display: flex;
    justify-content: center;
    align-items: center;
}

// 2.
div.parent {
    position: relative;
}
div.child {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}

// 3.
div.parent {
    display: grid;
}
div.child {
    justify-self: center;
    align-self: center;
}

// 4.
div.parent {
    font-size: 0;
    text-align: center;
    &::before {
        content: "";
        display: inline-block;
        width: 0;
        height: 100%;
        vertical-align: middle;
    }
}
div.child {
    display: inline-block;
    vertical-align: middle;
}

// 5.
div.parent {
    display: flex;
}
div.child {
    margin: auto;
}