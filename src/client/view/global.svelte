<style lang="scss" global>
  :root {
    --D-main-Color: #f4645f;
    --D-stick-Color: #ff81aa;
    --D-Height-Color: rgba(128, 128, 128, 0.8);
    --D-Centre-Color: rgba(128, 128, 128, 0.5);
    --D-Low-Color: rgba(128, 128, 128, 0.2);
  }

  #Discuss {
    * {
      box-sizing: border-box;
    }

    [disabled],
    [disabled]:hover {
      opacity: 0.5;
      cursor: not-allowed;
      cursor: no-drop;
    }
  }

  .D-svg {
    display: flex;
    width: inherit;
    height: inherit;
  }

  .D-loading-comments {
    display: flex;
    margin: 60px 0;
    justify-content: center;

    svg {
      width: auto;
      height: 50px;
    }
  }

  .D-link {
    color: #00c4b6;
    text-decoration: none;
  }

  .D-ellipsis {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .D-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0.9;
    outline: none;
    line-height: 1;
    width: auto;
    height: 28px;
    cursor: pointer;
    text-align: center;
    font-weight: 600;
    padding: 6px;
    font-size: 14px;
    color: #606266;
    border: 1px solid #dcdfe6;
    background: #fff;
    transition: 0.1s;
    border-radius: 4px;
    box-sizing: border-box;
    white-space: nowrap;
    user-select: none;
  }

  .D-select-none {
    user-select: none;
  }

  .D-btn:hover {
    opacity: 1;
  }

  .D-btn-main {
    color: #fff;
    border-color: var(--D-main-Color);
    background-color: var(--D-main-Color);
  }
  #Discuss .D-disabled-click {
    cursor: not-allowed;
    cursor: no-drop;
  }
  .D-disabled,
  .D-disabled:hover {
    opacity: 0.5;
  }

  #Discuss .D-comment-emot {
    width: 32px;
    height: auto;
    vertical-align: middle;
  }
  /* 消息提示框容器样式 */
  .D-msg {
    left: 50%;
    color: #909399;
    font-size: 14px;
    width: 300px;
    padding: 16px 17px;
    position: fixed;
    line-height: 1;
    letter-spacing: 1px;
    word-wrap: break-word;
    word-break: break-all;
    z-index: 9999999999;
    border-radius: 6px;
    border: 1px solid #edf2fc;
    background-color: #edf2fc;
    transform: translateX(-50%);
    transition: opacity 0.3s, transform 0.5s, top 0.5s;
  }

  .D-msg-opacity {
    opacity: 0;
    transform: translate(-50%, -100%);
  }

  /* 成功提示框样式 */
  .D-msg-success {
    background-color: #e1f3d8;
    border-color: #e1f3d8;
    color: #67c23a;
  }

  /* 警告提示框样式 */
  .D-msg-warn {
    background-color: #fdfce6;
    border-color: #fdfce6;
    color: #e6a23c;
  }
  /* 错误提示框样式 */
  .D-msg-error {
    background-color: #fef0f0;
    border-color: #fef0f0;
    color: #f56c6c;
  }

  .D-zoom {
    animation: D-zoom-animation 0.3s forwards;
  }

  .D-shrink {
    animation: D-shrink-animation 0.5s forwards;
  }

  @keyframes D-zoom-animation {
    0% {
      opacity: 0;
      transform: scale(0.7);
    }

    100% {
      opacity: 1;
      visibility: visible;
      transform: scale(1);
    }
  }

  @keyframes D-shrink-animation {
    0% {
      opacity: 1;
      transform: scale(1);
    }

    100% {
      opacity: 0;
      visibility: hidden;
      transform: scale(0.7);
    }
  }
</style>
