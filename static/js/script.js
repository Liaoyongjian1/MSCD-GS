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

        this.updateLayout();
    }

    updateLayout() {
        const xPercent = this.xPosition;
        const yPercent = this.yPercent;
        const xPixels = this.container.offsetWidth * xPercent / 100;
        const yPixels = this.container.offsetHeight * yPercent / 100;

        // 更新滑块位置 - 使用百分比
        this.handle.style.left = xPercent + '%';
        this.handle.style.top = yPercent + '%';

        // 根据滑块位置决定图像显示逻辑
        // 中心区域：丄形状分割三个图像
        if (xPercent >= 25 && xPercent <= 75 && yPercent >= 25 && yPercent <= 75) {
            // 左上区域：BarDGS
            this.bardgsLayer.style.clip = 'rect(0, ' + xPixels + 'px, ' + yPixels + 'px, 0)';
            this.bardgsLayer.style.display = 'block';

            // 右上区域：Ours
            this.oursLayer.style.clip = 'rect(0, ' + this.container.offsetWidth + 'px, ' + yPixels + 'px, ' + xPixels + 'px)';
            this.oursLayer.style.display = 'block';

            // 下方区域：GT
            this.gtLayer.style.clip = 'rect(' + yPixels + 'px, ' + this.container.offsetWidth + 'px, ' + this.container.offsetHeight + 'px, 0)';
            this.gtLayer.style.display = 'block';

            // 显示滑块条
            if (horizontalBar) horizontalBar.style.display = 'block';
            if (verticalBar) verticalBar.style.display = 'block';
        }
        // 左上角：显示GT
        else if (xPercent < 33 && yPercent < 33) {
            this.gtLayer.style.clip = 'auto';
            this.gtLayer.style.display = 'block';
            this.oursLayer.style.display = 'none';
            this.bardgsLayer.style.display = 'none';

            // 隐藏滑块条
            if (horizontalBar) horizontalBar.style.display = 'none';
            if (verticalBar) verticalBar.style.display = 'none';
        }
        // 右上角：显示GT
        else if (xPercent > 67 && yPercent < 33) {
            this.gtLayer.style.clip = 'auto';
            this.gtLayer.style.display = 'block';
            this.oursLayer.style.display = 'none';
            this.bardgsLayer.style.display = 'none';

            // 隐藏滑块条
            if (horizontalBar) horizontalBar.style.display = 'none';
            if (verticalBar) verticalBar.style.display = 'none';
        }
        // 左下角：显示Ours
        else if (xPercent < 33 && yPercent > 67) {
            this.oursLayer.style.clip = 'auto';
            this.oursLayer.style.display = 'block';
            this.gtLayer.style.display = 'none';
            this.bardgsLayer.style.display = 'none';

            // 隐藏滑块条
            if (horizontalBar) horizontalBar.style.display = 'none';
            if (verticalBar) verticalBar.style.display = 'none';
        }
        // 右下角：显示BarDGS
        else if (xPercent > 67 && yPercent > 67) {
            this.bardgsLayer.style.clip = 'auto';
            this.bardgsLayer.style.display = 'block';
            this.gtLayer.style.display = 'none';
            this.oursLayer.style.display = 'none';

            // 隐藏滑块条
            if (horizontalBar) horizontalBar.style.display = 'none';
            if (verticalBar) verticalBar.style.display = 'none';
        }
        // 边界过渡区域：动态混合
        else {
            this.gtLayer.style.clip = 'auto';
            this.gtLayer.style.display = 'block';
            this.oursLayer.style.display = 'none';
            this.bardgsLayer.style.display = 'none';

            // 隐藏滑块条
            if (horizontalBar) horizontalBar.style.display = 'none';
            if (verticalBar) verticalBar.style.display = 'none';
        }

        // 更新滑块标签显示
        this.updateLabels(xPercent, yPercent);
    }

    updateLabels(xPercent, yPercent) {
        const gtLabel = this.gtLayer.querySelector('.gt-label');
        const oursLabel = this.oursLayer.querySelector('.ours-label');
        const bardgsLabel = this.bardgsLayer.querySelector('.bardgs-label');

        // 根据滑块位置决定哪些标签可见
        if (gtLabel) gtLabel.style.display = 'none';
        if (oursLabel) oursLabel.style.display = 'none';
        if (bardgsLabel) bardgsLabel.style.display = 'none';

        if (xPercent >= 25 && xPercent <= 75 && yPercent >= 25 && yPercent <= 75) {
            // 中心区域显示所有标签
            if (gtLabel) gtLabel.style.display = 'block';
            if (oursLabel) oursLabel.style.display = 'block';
            if (bardgsLabel) bardgsLabel.style.display = 'block';
        } else if (xPercent < 33 && yPercent < 33) {
            // 左上角显示GT标签
            if (gtLabel) gtLabel.style.display = 'block';
        } else if (xPercent > 67 && yPercent < 33) {
            // 右上角显示GT标签
            if (gtLabel) gtLabel.style.display = 'block';
        } else if (xPercent < 33 && yPercent > 67) {
            // 左下角显示Ours标签
            if (oursLabel) oursLabel.style.display = 'block';
        } else if (xPercent > 67 && yPercent > 67) {
            // 右下角显示BarDGS标签
            if (bardgsLabel) bardgsLabel.style.display = 'block';
        }
    }
}
