class BeforeAfter {
    constructor(enteryObject) {

        const beforeAfterContainer = document.querySelector(enteryObject.id);
        const before = beforeAfterContainer.querySelector('.bal-before');
        const beforeText = beforeAfterContainer.querySelector('.bal-beforePosition');
        const afterText = beforeAfterContainer.querySelector('.bal-afterPosition');
        const handle = beforeAfterContainer.querySelector('.bal-handle');
        var widthChange = 0;

        beforeAfterContainer.querySelector('.bal-before-inset').setAttribute("style", "width: " + beforeAfterContainer.offsetWidth + "px;")
        window.addEventListener('resize', function () {
            beforeAfterContainer.querySelector('.bal-before-inset').setAttribute("style", "width: " + beforeAfterContainer.offsetWidth + "px;")
        });
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

        // 三个图像层
        this.leftSection = this.container.querySelector('.bal-left');    // BarDGS (左侧)
        this.middleSection = this.container.querySelector('.bal-middle');  // Ours (中间)
        this.rightSection = this.container.querySelector('.bal-right');   // GT (右侧)

        // 两个滑块
        this.leftHandle = this.container.querySelector('.bal-handle-left');   // 左侧滑块
        this.rightHandle = this.container.querySelector('.bal-handle-right'); // 右侧滑块

        if (!this.leftSection || !this.middleSection || !this.rightSection || !this.leftHandle || !this.rightHandle) {
            console.error('Required elements not found in:', entryObject.id);
            return;
        }

        // 两个滑块位置状态 (将屏幕分为三份)
        this.leftPosition = 33.33;  // 左滑块位置
        this.rightPosition = 66.67; // 右滑块位置
        this.activeSlider = null;   // 当前活动的滑块
        this.isHovering = false;    // 是否正在悬停

        this.init();
        this.addEventListeners();
    }

    init() {
        // 设置初始inset宽度
        const leftInset = this.container.querySelector('.bal-left-inset');
        const middleInset = this.container.querySelector('.bal-middle-inset');
        const rightInset = this.container.querySelector('.bal-right-inset');

        if (leftInset) {
            leftInset.style.width = this.container.offsetWidth + 'px';
        }
        if (middleInset) {
            middleInset.style.width = this.container.offsetWidth + 'px';
        }
        if (rightInset) {
            rightInset.style.width = this.container.offsetWidth + 'px';
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
            const leftInset = this.container.querySelector('.bal-left-inset');
            const middleInset = this.container.querySelector('.bal-middle-inset');
            const rightInset = this.container.querySelector('.bal-right-inset');

            if (leftInset) {
                leftInset.style.width = this.container.offsetWidth + 'px';
            }
            if (middleInset) {
                middleInset.style.width = this.container.offsetWidth + 'px';
            }
            if (rightInset) {
                rightInset.style.width = this.container.offsetWidth + 'px';
            }
        });
    }

    detectAndMoveSlider(e) {
        const rect = this.container.getBoundingClientRect();
        const x = e.clientX - rect.left;

        // 计算当前滑块位置
        const leftHandlePos = (this.leftPosition / 100) * this.container.offsetWidth;
        const rightHandlePos = (this.rightPosition / 100) * this.container.offsetWidth;

        // 计算鼠标与滑块的绝对距离
        const leftDistance = Math.abs(x - leftHandlePos);
        const rightDistance = Math.abs(x - rightHandlePos);

        // 自动判断应该移动哪个滑块
        if (leftDistance < rightDistance) {
            this.activeSlider = 'left';
            this.leftPosition = Math.max(5, Math.min(this.rightPosition - 5, (x / this.container.offsetWidth) * 100));
        } else {
            this.activeSlider = 'right';
            this.rightPosition = Math.max(this.leftPosition + 5, Math.min(95, (x / this.container.offsetWidth) * 100));
        }

        this.updateLayout();
    }

    detectSlider(e) {
        const rect = this.container.getBoundingClientRect();
        const x = e.clientX - rect.left;

        const leftHandlePos = (this.leftPosition / 100) * this.container.offsetWidth;
        const rightHandlePos = (this.rightPosition / 100) * this.container.offsetWidth;

        // 检查是否点击滑块附近（30px范围内）
        if (Math.abs(x - leftHandlePos) < 30) {
            return 'left';
        }
        if (Math.abs(x - rightHandlePos) < 30) {
            return 'right';
        }

        return null;
    }

    updateSlider(e) {
        const rect = this.container.getBoundingClientRect();
        const x = e.clientX - rect.left;

        if (this.activeSlider === 'left') {
            this.leftPosition = Math.max(5, Math.min(this.rightPosition - 5, (x / this.container.offsetWidth) * 100));
        } else if (this.activeSlider === 'right') {
            this.rightPosition = Math.max(this.leftPosition + 5, Math.min(95, (x / this.container.offsetWidth) * 100));
        }

        this.updateLayout();
    }

    updateLayout() {
        // 更新三个区域布局
        this.leftSection.style.left = '0%';
        this.leftSection.style.width = this.leftPosition + '%';

        this.middleSection.style.left = this.leftPosition + '%';
        this.middleSection.style.width = (this.rightPosition - this.leftPosition) + '%';

        this.rightSection.style.left = this.rightPosition + '%';
        this.rightSection.style.width = (100 - this.rightPosition) + '%';

        // 更新滑块位置
        this.leftHandle.style.left = this.leftPosition + '%';
        this.rightHandle.style.left = this.rightPosition + '%';
    }
}
