import { Alert, Checkbox, Icon } from 'antd';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import React, { Component } from 'react';
import Link from 'umi/link';
import { connect } from 'dva';
import LoginComponents from './components/Login';
import styles from './style.less';

const { Tab, UserName, Password, Mobile, Captcha, Submit } = LoginComponents;

class UserLogin extends Component {
  loginForm = undefined;

  state = {
    type: 'account',
    autoLogin: true,
  };

  changeAutoLogin = e => {
    this.setState({
      autoLogin: e.target.checked,
    });
  };

  handleSubmit = (err, values) => {
    const { type } = this.state;

    if (!err) {
      const { dispatch } = this.props;
      dispatch({
        type: 'userAndUserLogin/login',
        payload: { ...values, type },
      });
    }
  };

  onTabChange = type => {
    this.setState({
      type,
    });
  };

  onGetCaptcha = () =>
    new Promise((resolve, reject) => {
      if (!this.loginForm) {
        return;
      }

      this.loginForm.validateFields(['mobile'], {}, (err, values) => {
        if (err) {
          reject(err);
        } else {
          const { dispatch } = this.props;
          dispatch({
            type: 'userAndUserLogin/getCaptcha',
            payload: values.mobile,
          })
            .then(resolve)
            .catch(reject);
        }
      });
    });

  renderMessage = content => (
    <Alert
      style={{
        marginBottom: 24,
      }}
      message={content}
      type="error"
      showIcon
    />
  );

  render() {
    const { userAndUserLogin, submitting } = this.props;
    const { status, type: loginType } = userAndUserLogin;
    const { type, autoLogin } = this.state;
    return (
      <div className={styles.main}>
        <LoginComponents
          defaultActiveKey={type}
          onTabChange={this.onTabChange}
          onSubmit={this.handleSubmit}
          ref={form => {
            this.loginForm = form;
          }}
        >
          <Tab
            key="account"
            tab={formatMessage({
              id: 'useranduserlogin.login.tab-login-credentials',
            })}
          >
            {status === 'error' &&
              loginType === 'account' &&
              !submitting &&
              this.renderMessage(
                formatMessage({
                  id: 'useranduserlogin.login.message-invalid-credentials',
                }),
              )}
            <UserName
              name="userName"
              placeholder={`${formatMessage({
                id: 'useranduserlogin.login.userName',
              })}: admin or user`}
              rules={[
                {
                  required: true,
                  message: formatMessage({
                    id: 'useranduserlogin.userName.required',
                  }),
                },
              ]}
            />
            <Password
              name="password"
              placeholder={`${formatMessage({
                id: 'useranduserlogin.login.password',
              })}: ant.design`}
              rules={[
                {
                  required: true,
                  message: formatMessage({
                    id: 'useranduserlogin.password.required',
                  }),
                },
              ]}
              onPressEnter={e => {
                e.preventDefault();

                if (this.loginForm) {
                  this.loginForm.validateFields(this.handleSubmit);
                }
              }}
            />
          </Tab>
          <Tab
            key="mobile"
            tab={formatMessage({
              id: 'useranduserlogin.login.tab-login-mobile',
            })}
          >
            {status === 'error' &&
              loginType === 'mobile' &&
              !submitting &&
              this.renderMessage(
                formatMessage({
                  id: 'useranduserlogin.login.message-invalid-verification-code',
                }),
              )}
            <Mobile
              name="mobile"
              placeholder={formatMessage({
                id: 'useranduserlogin.phone-number.placeholder',
              })}
              rules={[
                {
                  required: true,
                  message: formatMessage({
                    id: 'useranduserlogin.phone-number.required',
                  }),
                },
                {
                  pattern: /^1\d{10}$/,
                  message: formatMessage({
                    id: 'useranduserlogin.phone-number.wrong-format',
                  }),
                },
              ]}
            />
            <Captcha
              name="captcha"
              placeholder={formatMessage({
                id: 'useranduserlogin.verification-code.placeholder',
              })}
              countDown={120}
              onGetCaptcha={this.onGetCaptcha}
              getCaptchaButtonText={formatMessage({
                id: 'useranduserlogin.form.get-captcha',
              })}
              getCaptchaSecondText={formatMessage({
                id: 'useranduserlogin.captcha.second',
              })}
              rules={[
                {
                  required: true,
                  message: formatMessage({
                    id: 'useranduserlogin.verification-code.required',
                  }),
                },
              ]}
            />
          </Tab>
          <div>
            <Checkbox checked={autoLogin} onChange={this.changeAutoLogin}>
              <FormattedMessage id="useranduserlogin.login.remember-me" />
            </Checkbox>
            <a
              style={{
                float: 'right',
              }}
              href=""
            >
              <FormattedMessage id="useranduserlogin.login.forgot-password" />
            </a>
          </div>
          <Submit loading={submitting}>
            <FormattedMessage id="useranduserlogin.login.login" />
          </Submit>
          <div className={styles.other}>
            <FormattedMessage id="useranduserlogin.login.sign-in-with" />
            <Icon type="alipay-circle" className={styles.icon} theme="outlined" />
            <Icon type="taobao-circle" className={styles.icon} theme="outlined" />
            <Icon type="weibo-circle" className={styles.icon} theme="outlined" />
            <Link className={styles.register} to="/user/register">
              <FormattedMessage id="useranduserlogin.login.signup" />
            </Link>
          </div>
        </LoginComponents>
      </div>
    );
  }
}

export default connect(({ userAndUserLogin, loading }) => ({
  userAndUserLogin,
  submitting: loading.effects['userAndUserLogin/login'],
}))(UserLogin);
