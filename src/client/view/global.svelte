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
