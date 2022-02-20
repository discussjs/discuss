export default {
  nick: 'Nick',
  mail: 'Mail',
  site: 'Site',
  content: 'Comment your thoughts~',
  cancel: 'Cancel',
  preview: 'Preview',
  send: 'Send',
  comment: 'Comments',
  master: 'Admin',
  stick: 'Top',
  reply: 'Reply',
  timeAgo: {
    now: 'Just now',
    minutes: 'Minutes ago',
    hours: 'Hours ago',
    days: 'Days ago'
  },
  more: 'More Comments',
  commentsError: 'Failed to get comments~',
  settingMsg: 'Loading admin panel...',
  refreshMsg: 'Refreshing comments...',
  admin: {
    login: {
      login: 'Sign in',
      close: 'Close',
      username: 'Username',
      password: 'Password',
      msg: 'Automatic login in progress...',
      loginError: 'User name or password error'
    },
    manage: {
      comment: {
        msg: 'Get comments automatically...',
        text: 'Comments',
        save: 'Save',
        time: 'Time',
        path: 'Path',
        total: '',
        bar: 'entries',
        page: 'Page',
        search: {
          text: 'Search',
          close: 'Close',
          title: 'Search Comments',
          options: {
            all: 'All',
            ip: 'IP',
            nick: 'Nick',
            mail: 'Mail',
            site: 'Site',
            content: 'Content',
            path: 'Path'
          }
        },
        batch: {
          operateMsg: 'Select at least one comment',
          operate: {
            default: 'Default',
            accept: 'Accept',
            audit: 'Audit',
            spam: 'Spam',
            delete: 'Delete'
          }
        },
        operate: {
          stick: 'Top',
          accept: 'Accept',
          audit: 'Audit',
          edit: 'Edit',
          spam: 'Spam',
          delete: 'Delete'
        },
        options: {
          current: 'Current page',
          accept: 'Passed',
          audit: 'Pending review',
          spam: 'Spam',
          master: 'Mine'
        }
      },
      config: {
        msg: 'Automatic get configuration...',
        error: 'Failed to get configuration',
        text: 'Configuration',
        save: 'Save',
        passwordError: 'Inconsistent passwords',
        settings: {
          basic: {
            name: 'Basic',
            // username
            user: {
              title: 'Username',
              desc: 'Login Username',
              ph: 'Name'
            },
            mail: {
              title: 'Administrator Email',
              desc: 'Confirm administrator identity',
              ph: 'mail@example.com'
            },
            domain: {
              title: 'Secure Domain',
              // eslint-disable-next-line max-len
              desc: 'Restrict other third-party website requests from being blocked (multiple comma-separated)',
              ph: 'example.com,www.example.com'
            },
            headers: {
              title: 'Request header priority',
              // eslint-disable-next-line max-len
              desc: 'To ensure that the acquired user IPs are authentic (use commas to separate multiple ones)',
              ph: 'headers.cf-connecting-ip'
            }
          },
          commentHandle: {
            name: 'Comments',
            // commentCount
            count: {
              title: 'Comment Count',
              desc: 'How many comments to get at a time',
              ph: 6
            },
            // wordNumber
            word: {
              title: 'Word limit',
              // eslint-disable-next-line max-len
              desc: 'Comment content, nickname, email, website (split by English comma, enter only a 0 for all unrestricted)',
              ph: 0
            },
            limit: {
              title: 'Limit',
              desc: 'Limit how many comments an IP can make in 10 minutes',
              ph: 0
            },
            limitAll: {
              title: 'Limit all people',
              // eslint-disable-next-line max-len
              desc: 'Limit all people within 10 minutes, all IP can comment on how many',
              ph: 0
            },
            // avatarCdn
            cdn: {
              title: 'Avatar CDN',
              desc: 'Comment avatar CDN address',
              ph: 'https://cn.gravatar.com/avatar/'
            },
            akismet: {
              title: 'Akismet',
              desc: 'Spam comment detection and processing',
              ph: 'Akismet Key'
            }
          },
          mail: {
            name: 'Email Alerts',
            // siteUrl
            site: {
              title: 'Website address',
              // eslint-disable-next-line max-len
              desc: 'Quick jump to the comment section of the website within the email',
              ph: 'https://blog.example.com'
            },
            // serverURLs
            server: {
              title: 'Server side address',
              // eslint-disable-next-line max-len
              desc: "Comment system server address (same as the client's serverURLs)",
              ph: 'https://server-discuss.example.com'
            },
            // mailHost
            host: {
              title: 'Service Provider Hosting',
              desc: 'For example: Tencent Enterprise Hosting',
              ph: 'smtp.exmail.qq.com'
            },
            // mailPort
            port: {
              title: 'Service Provider Hosting Port',
              desc: 'Example: Tencent Enterprise Hosting Port',
              ph: 465
            },
            // mailFrom
            from: {
              title: 'Sender',
              ph: 'Example: server@example.com'
            },
            // mailAccept
            accept: {
              title: 'Authorization code or password',
              desc: 'Each service provider is different'
            },
            // masterSubject
            Msubject: {
              title: 'Mail Title(Administrator)',
              desc: 'Title of the comment email received by the administrator',
              ph: 'You have a new review on "Discuss Official Website"!'
            },
            // replySubject
            Rsubject: {
              title: 'Mail title (commenter)',
              desc: 'Title of comments received by others',
              ph: 'You have a new comment on "Discuss Official Website"!'
            },
            // masterTemplate
            Mtemplate: {
              title: 'Email Template (Administrator)',
              desc: 'Template for comment emails received by administrators'
            },
            // replyTemplate
            Rtemplate: {
              title: 'Email Template (Commenter)',
              desc: 'Template for comments received by others'
            }
          },
          password: {
            name: 'Password',
            // password
            pwd: 'New Password',
            // confirm
            cfm: 'Confirm Password'
          }
        }
      }
    }
  }
}
