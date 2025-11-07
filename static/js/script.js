class BeforeAfter {
    constructor(enteryObject) {

        const beforeAfterContainer = document.querySelector(enteryObject.id);
        const before = beforeAfterContainer.querySelector('.bal-before');
        const beforeText = beforeAfterContainer.querySelector('.bal-beforePosition');
        const afterText = beforeAfterContainer.querySelector('.bal-afterPosition');
        const handle = beforeAfterContainer.querySelector('.bal-handle');
        var widthChange = 0;

        beforeAfterContainer.querySelector('.bal-before-inset').setAttribute("style", "width: " + beforeAfterContainer.offsetWidth + "px;")
        window.onresize = function () {
            beforeAfterContainer.querySelector('.bal-before-inset').setAttribute("style", "width: " + beforeAfterContainer.offsetWidth + "px;")
        }
        before.setAttribute('style', "width: 50%;");
        handle.setAttribute('style', "left: 50%;");

        //touch screen event listener
        beforeAfterContainer.addEventListener("touchstart", (e) => {

            beforeAfterContainer.addEventListener("touchmove", (e2) => {
                let containerWidth = beforeAfterContainer.offsetWidth;
                let currentPoint = e2.changedTouches[0].clientX;

                let startOfDiv = beforeAfterContainer.offsetLeft;

                let modifiedCurrentPoint = currentPoint - startOfDiv;

                if (modifiedCurrentPoint > 10 && modifiedCurrentPoint < beforeAfterContainer.offsetWidth - 10) {
                    let newWidth = modifiedCurrentPoint * 100 / containerWidth;

                    before.setAttribute('style', "width:" + newWidth + "%;");
                    afterText.setAttribute('style', "z-index: 1;");
                    handle.setAttribute('style', "left:" + newWidth + "%;");
                }
            });
        });

        //mouse move event listener
        beforeAfterContainer.addEventListener('mousemove', (e) => {
            let containerWidth = beforeAfterContainer.offsetWidth;
            widthChange = e.offsetX;
            let newWidth = widthChange * 100 / containerWidth;

            if (e.offsetX > 10 && e.offsetX < beforeAfterContainer.offsetWidth - 10) {
                before.setAttribute('style', "width:" + newWidth + "%;");
                afterText.setAttribute('style', "z-index:" + "1;");
                handle.setAttribute('style', "left:" + newWidth + "%;");
            }
        })

    }
}

class TripleComparison {
    constructor(entryObject) {
        console.log("初始化TripleComparison (双滑块三区域):", entryObject.id);

        this.container = document.querySelector(entryObject.id);
        if (!this.container) {
            console.error('Container not found:', entryObject.id);
            return;
        }

        this.before = this.container.querySelector('.bal-before');  // BarDGS (左侧区域)
        this.middle = this.container.querySelector('.bal-middle');  // Ours (右侧区域)
        this.after = this.container.querySelector('.bal-after');    // GT (背景)
        this.handleHorizontal = this.container.querySelector('.bal-handle-horizontal');
        this.handleVertical = this.container.querySelector('.bal-handle-vertical');

        if (!this.before || !this.middle || !this.after || !this.handleHorizontal || !this.handleVertical) {
            console.error('Required elements not found in:', entryObject.id);
            return;
        }

        // 双滑块位置状态
        this.horizontalPosition = 50; // 水平滑块位置 (左右分割)
        this.verticalPosition = 50;   // 垂直滑块位置 (上下分割)
        this.activeSlider = null;     // 当前活动的滑块
        this.isHovering = false;      // 是否正在悬停

        this.init();
        this.addEventListeners();
    }

    init() {
        // 设置初始inset宽度
        const beforeInset = this.container.querySelector('.bal-before-inset');
        const middleInset = this.container.querySelector('.bal-middle-inset');
        if (beforeInset) {
            beforeInset.style.width = this.container.offsetWidth + 'px';
        }
        if (middleInset) {
            middleInset.style.width = this.container.offsetWidth + 'px';
        }

        this.updateLayout();
    }

    addEventListeners() {
        // 鼠标进入/离开事件（用于自动拖动）
        this.container.addEventListener('mouseenter', () => {
            this.isHovering = true;
        });

        this.container.addEventListener('mouseleave', () => {
            this.isHovering = false;
            this.activeSlider = null;
        });

        // 鼠标移动事件（自动拖动）
        this.container.addEventListener('mousemove', (e) => {
            if (this.isHovering) {
                this.detectAndMoveSlider(e);
            }
        });

        // 触摸事件
        this.container.addEventListener('touchstart', (e) => {
            this.activeSlider = this.detectSlider(e.touches[0]);
            if (this.activeSlider) {
                this.updateSlider(e.touches[0]);
            }
        });

        this.container.addEventListener('touchmove', (e) => {
            if (this.activeSlider) {
                e.preventDefault();
                this.updateSlider(e.touches[0]);
            }
        });

        this.container.addEventListener('touchend', () => {
            this.activeSlider = null;
        });

        // 窗口大小调整
        window.addEventListener('resize', () => {
            const beforeInset = this.container.querySelector('.bal-before-inset');
            const middleInset = this.container.querySelector('.bal-middle-inset');
            if (beforeInset) {
                beforeInset.style.width = this.container.offsetWidth + 'px';
            }
            if (middleInset) {
                middleInset.style.width = this.container.offsetWidth + 'px';
            }
        });
    }

    detectAndMoveSlider(e) {
        const rect = this.container.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // 自动判断应该移动哪个滑块
        const currentHorizontalPos = (this.horizontalPosition / 100) * this.container.offsetWidth;
        const currentVerticalPos = (this.verticalPosition / 100) * this.container.offsetHeight;

        // 根据鼠标位置与当前滑块位置的接近程度来判断
        const horizontalDistance = Math.abs(x - currentHorizontalPos);
        const verticalDistance = Math.abs(y - currentVerticalPos);

        if (horizontalDistance < verticalDistance) {
            // 更接近水平滑块，移动水平滑块
            this.activeSlider = 'horizontal';
            this.horizontalPosition = Math.max(10, Math.min(90, (x / this.container.offsetWidth) * 100));
        } else {
            // 更接近垂直滑块，移动垂直滑块
            this.activeSlider = 'vertical';
            this.verticalPosition = Math.max(10, Math.min(90, (y / this.container.offsetHeight) * 100));
        }

        this.updateLayout();
    }

    detectSlider(e) {
        const rect = this.container.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const horizontalHandlePos = (this.horizontalPosition / 100) * this.container.offsetWidth;
        const verticalHandlePos = (this.verticalPosition / 100) * this.container.offsetHeight;

        // 检查是否点击滑块附近（30px范围内）
        if (Math.abs(x - horizontalHandlePos) < 30) {
            return 'horizontal';
        }
        if (Math.abs(y - verticalHandlePos) < 30) {
            return 'vertical';
        }

        return null;
    }

    updateSlider(e) {
        const rect = this.container.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        if (this.activeSlider === 'horizontal') {
            this.horizontalPosition = Math.max(10, Math.min(90, (x / this.container.offsetWidth) * 100));
        } else if (this.activeSlider === 'vertical') {
            this.verticalPosition = Math.max(10, Math.min(90, (y / this.container.offsetHeight) * 100));
        }

        this.updateLayout();
    }

    updateLayout() {
        const hPos = this.horizontalPosition;
        const vPos = this.verticalPosition;

        // 更新BarDGS区域 (左侧)
        this.before.style.left = '0%';
        this.before.style.top = '0%';
        this.before.style.width = hPos + '%';
        this.before.style.height = vPos + '%';

        // 更新Ours区域 (右侧)
        this.middle.style.left = hPos + '%';
        this.middle.style.top = '0%';
        this.middle.style.width = (100 - hPos) + '%';
        this.middle.style.height = vPos + '%';

        // 更新滑块位置
        this.handleHorizontal.style.left = hPos + '%';
        this.handleHorizontal.style.top = vPos + '%';
        this.handleVertical.style.left = hPos + '%';
        this.handleVertical.style.top = vPos + '%';
    }
}
