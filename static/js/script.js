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
        console.log("初始化TripleComparison (丄形状单滑块):", entryObject.id);

        this.container = document.querySelector(entryObject.id);
        if (!this.container) {
            console.error('Container not found:', entryObject.id);
            return;
        }

        // 三个图像层
        this.gtLayer = this.container.querySelector('.bal-gt');         // GT (底层)
        this.oursLayer = this.container.querySelector('.bal-ours');     // Ours (中间层)
        this.bardgsLayer = this.container.querySelector('.bal-bardgs'); // BarDGS (顶层)

        // 丄形状滑块
        this.handle = this.container.querySelector('.bal-handle-shape');

        
        if (!this.gtLayer || !this.oursLayer || !this.bardgsLayer || !this.handle) {
            console.error('Required elements not found in:', entryObject.id);
            return;
        }

        // 滑块位置状态
        this.xPosition = 50; // 水平位置 (0-100)
        this.yPosition = 50; // 垂直位置 (0-100)
        this.isHovering = false;

        this.init();
        this.addEventListeners();
    }

    init() {
        // 设置初始inset宽度
        const gtInset = this.container.querySelector('.bal-gt-inset');
        const oursInset = this.container.querySelector('.bal-ours-inset');
        const bardgsInset = this.container.querySelector('.bal-bardgs-inset');

        if (gtInset) {
            gtInset.style.width = this.container.offsetWidth + 'px';
        }
        if (oursInset) {
            oursInset.style.width = this.container.offsetWidth + 'px';
        }
        if (bardgsInset) {
            bardgsInset.style.width = this.container.offsetWidth + 'px';
        }

        // 初始时默认显示GT图像
        this.gtLayer.style.clip = 'auto';
        this.gtLayer.style.display = 'block';
        this.oursLayer.style.display = 'none';
        this.bardgsLayer.style.display = 'none';

        // 设置滑块初始位置在中心
        this.xPosition = 50;
        this.yPosition = 50;

        this.updateLayout();
    }

    addEventListeners() {
        // 鼠标进入/离开事件（用于自动拖动）
        this.container.addEventListener('mouseenter', () => {
            this.isHovering = true;
        });

        this.container.addEventListener('mouseleave', () => {
            this.isHovering = false;
        });

        // 鼠标移动事件（自动拖动）
        this.container.addEventListener('mousemove', (e) => {
            if (this.isHovering) {
                this.updateSlider(e);
            }
        });

        // 触摸事件
        this.container.addEventListener('touchstart', (e) => {
            this.updateSlider(e.touches[0]);
        });

        this.container.addEventListener('touchmove', (e) => {
            e.preventDefault();
            this.updateSlider(e.touches[0]);
        });

        // 窗口大小调整
        window.addEventListener('resize', () => {
            const gtInset = this.container.querySelector('.bal-gt-inset');
            const oursInset = this.container.querySelector('.bal-ours-inset');
            const bardgsInset = this.container.querySelector('.bal-bardgs-inset');

            if (gtInset) {
                gtInset.style.width = this.container.offsetWidth + 'px';
            }
            if (oursInset) {
                oursInset.style.width = this.container.offsetWidth + 'px';
            }
            if (bardgsInset) {
                bardgsInset.style.width = this.container.offsetWidth + 'px';
            }
        });
    }

    updateSlider(e) {
        const rect = this.container.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // 更新滑块位置
        this.xPosition = Math.max(0, Math.min(100, (x / this.container.offsetWidth) * 100));
        this.yPosition = Math.max(0, Math.min(100, (y / this.container.offsetHeight) * 100));

        // 立即更新滑块位置，确保滑块跟随鼠标
        this.handle.style.left = this.xPosition + '%';
        this.handle.style.top = this.yPosition + '%';

        // 更新滑块条的位置
        const xPixels = this.container.offsetWidth * this.xPosition / 100;
        const yPixels = this.container.offsetHeight * this.yPosition / 100;

        const horizontalBar = this.handle.querySelector('.handle-horizontal-bar');
        const verticalBar = this.handle.querySelector('.handle-vertical-bar');

        if (horizontalBar) {
            horizontalBar.style.top = yPixels + 'px';
        }
        if (verticalBar) {
            verticalBar.style.left = xPixels + 'px';
        }

        this.updateLayout();
    }

    updateLayout() {
        const xPercent = this.xPosition;
        const yPercent = this.yPosition;
        const xPixels = this.container.offsetWidth * xPercent / 100;
        const yPixels = this.container.offsetHeight * yPercent / 100;

        // 根据鼠标位置决定图像显示逻辑
        // 计算距离各个角落的距离
        const distToUpperLeft = Math.sqrt(xPercent * xPercent + yPercent * yPercent);
        const distToLowerLeft = Math.sqrt(xPercent * xPercent + (100 - yPercent) * (100 - yPercent));
        const distToLowerRight = Math.sqrt((100 - xPercent) * (100 - xPercent) + (100 - yPercent) * (100 - yPercent));

        // 找出最近的角落
        const minDist = Math.min(distToUpperLeft, distToLowerLeft, distToLowerRight);

        // 隐藏所有图层
        this.gtLayer.style.display = 'none';
        this.oursLayer.style.display = 'none';
        this.bardgsLayer.style.display = 'none';

        // 显示滑块条
        const horizontalBar = this.handle.querySelector('.handle-horizontal-bar');
        const verticalBar = this.handle.querySelector('.handle-vertical-bar');

        if (horizontalBar) horizontalBar.style.display = 'block';
        if (verticalBar) verticalBar.style.display = 'block';

        // 根据鼠标位置显示对应的图像
        if (minDist === distToUpperLeft) {
            // 鼠标靠近左上角：显示GT
            this.gtLayer.style.clip = 'auto';
            this.gtLayer.style.display = 'block';
            this.gtLayer.style.zIndex = '15';
        } else if (minDist === distToLowerLeft) {
            // 鼠标靠近左下角：显示Ours
            this.oursLayer.style.clip = 'auto';
            this.oursLayer.style.display = 'block';
            this.oursLayer.style.zIndex = '15';
        } else if (minDist === distToLowerRight) {
            // 鼠标靠近右下角：显示BarDGS
            this.bardgsLayer.style.clip = 'auto';
            this.bardgsLayer.style.display = 'block';
            this.bardgsLayer.style.zIndex = '15';
        }

        // 更新滑块标签显示
        this.updateLabels(xPercent, yPercent);
    }

    updateLabels(xPercent, yPercent) {
        const gtLabel = this.gtLayer.querySelector('.bal-gtPosition');
        const oursLabel = this.oursLayer.querySelector('.bal-oursPosition');
        const bardgsLabel = this.bardgsLayer.querySelector('.bal-bardgsPosition');

        // 隐藏所有标签
        if (gtLabel) gtLabel.style.display = 'none';
        if (oursLabel) oursLabel.style.display = 'none';
        if (bardgsLabel) bardgsLabel.style.display = 'none';

        // 根据鼠标位置显示对应的标签
        const distToUpperLeft = Math.sqrt(xPercent * xPercent + yPercent * yPercent);
        const distToLowerLeft = Math.sqrt(xPercent * xPercent + (100 - yPercent) * (100 - yPercent));
        const distToLowerRight = Math.sqrt((100 - xPercent) * (100 - xPercent) + (100 - yPercent) * (100 - yPercent));

        const minDist = Math.min(distToUpperLeft, distToLowerLeft, distToLowerRight);

        if (minDist === distToUpperLeft && gtLabel) {
            // 鼠标靠近左上角：显示GT标签
            gtLabel.style.display = 'block';
        } else if (minDist === distToLowerLeft && oursLabel) {
            // 鼠标靠近左下角：显示Ours标签
            oursLabel.style.display = 'block';
        } else if (minDist === distToLowerRight && bardgsLabel) {
            // 鼠标靠近右下角：显示BarDGS标签
            bardgsLabel.style.display = 'block';
        }
    }
}
