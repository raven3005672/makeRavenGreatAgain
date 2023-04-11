```js
// 用户模块hook
const useUser = () => {
    // react版本的用户状态
    const user = useState({});
    // vue版本的用户状态
    const userInfo = ref({});
    
    // 获取用户状态
    const getUserInfo = () => {}
    // 修改用户状态
    const changeUserInfo = () => {};
    // 检查两次输入的密码是否相同
    const checkRepeatPass = (oldPass，newPass) => {}
    // 修改密码
    const changePassword = () => {};
    
    return {
        userInfo,
        getUserInfo,
        changeUserInfo,
        checkRepeatPass,
        changePassword,
    }
}
```

```js
// 用户模块交互逻辑hooks
const useUserControl = () => {
    // 组合用户hook
    const { userInfo, getUserInfo, changeUserInfo, checkRepeatPass, changePassword } = useUser();
    // 数据查询loading状态
    const loading = ref(false);
    // 错误提示弹窗的状态
    const errorModalState = reactive({
        visible: false, // 弹窗显示/隐藏
        errorText: '',  // 弹窗文案
    });
    
    // 初始化数据
    const initData = () => {
        getUserInfo();
    }
    // 修改密码表单提交
    const onChangePassword = ({ oldPass, newPass ) => {
        // 判断两次密码是否一致
        if (checkRepeatPass(oldPass, newPass)) {
            changePassword();
        } else {
            errorModalState.visible = true;
            errorModalState.text = '两次输入的密码不一致，请修改'
        }
    };
    return {
        // 用户数据
        userInfo,
        // 初始化数据
        initData: getUserInfo,
        // 修改密码
        onChangePassword,
        // 修改用户信息
        onChangeUserInfo: changeUserInfo,
    }
}
```

```js
import useUserControl from './useUserControl';
import { useEffect } from 'react';

const UserModule = () => {
    const { userInfo, initData, onChangePassword, onChangeUserInfo } = useUserControl();
    useEffect(initData, []);
    return (
        // 视图部分省略，在对应btn处引用onChangePassword和onChangeUserInfo即可
    )
}

```