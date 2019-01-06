import React, { Component } from 'react';
import './App.css';
import {
  Form,
  Input,
  Icon,
  Button,
  Select,
  InputNumber,
  Radio,
  Checkbox
} from 'antd';

const Option = Select.Option;
const RadioGroup = Radio.Group;
const FormItem = Form.Item;

class AppFrom extends Component {

  constructor(props) {
    super();
    this.state = {}
  }

  //  返回一个UUID作为key
  returnUuid = (len, radix) => {
    let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
    let uuid = [],
      i;
    radix = radix || chars.length;

    if (len) {
      for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
    } else {
      let r;
      uuid[14] = '4';
      for (i = 0; i < 36; i++) {
        if (!uuid[i]) {
          r = 0 | Math.random() * 16;
          uuid[i] = chars[(i === 19) ? (r & 0x3) | 0x8 : r];
        }
      }
    }
    return uuid.join('');
  }

  //  删除一个key，即是删除一个组合
  remove = (k) => {
    const { form } = this.props;
    const keys = form.getFieldValue('keys');
    if (keys.length === 1) {
      return;
    }
    form.setFieldsValue({
      keys: keys.filter(key => key !== k),
    });
  }

  // 增加一个key，即是增加一个组合
  add = () => {
    const { form } = this.props;
    const keys = form.getFieldValue('keys');
    const nextKeys = keys.concat(this.returnUuid());
    form.setFieldsValue({
      keys: nextKeys,
    });
  }

  //  下拉选择联动下面的表单
  handleChange = (key, value) => {
    let pervState = this.state[key];
    let currentState = Object.assign({ ...pervState }, {
      selectValue: value
    })
    this.setState({
      [key]: currentState,
    })
  }

  componentDidMount() {
    this.add();
  }


  formatvalue = (values) => {
    let data = [];
    for (let k of values['keys']) {
      switch (values['selects'][k]) {
        case 'A':
          data.push({
            selectKey: values['selects'][k],
            value: values['inputs'][k],
          });
          break;
        case 'B':
          data.push({
            selectKey: values['selects'][k],
            value: values['inputNumbers'][k],
          });
          break;
        case 'C':
          data.push({
            selectKey: values['selects'][k],
            value: values['radioNumbers'][k],
          });
          break;
        case 'D':
          data.push({
            selectKey: values['selects'][k],
            value: values['checkLetters'][k],
          });
          break;
        default:
          break;
      }
    }
    return data;
  }
  //  提交数据
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('提交的值', this.formatvalue(values));
      }
    });
  }

  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 },
      },
    };
    const formItemLayoutWithOutLabel = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 20, offset: 4 },
      },
    };
    getFieldDecorator('keys', { initialValue: [] });
    const keys = getFieldValue('keys');
    const formItems = keys.map((k, index) => (
      <div key={k} className="group">
        <FormItem
          {...(formItemLayout)}
          label='选择值'
          required={true}
        >
          {getFieldDecorator(`selects[${k}]`, {
            validateTrigger: ['onChange', 'onBlur'],
            rules: [{
              required: true,
              message: "请选择一个值",
            }],
          })(
            <Select
              showSearch
              style={{ width: 200 }}
              placeholder="请选择一个值"
              optionFilterProp="children"
              onChange={this.handleChange.bind(this, k)}
              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            >
              <Option value="A">A</Option>
              <Option value="B">B</Option>
              <Option value="C">C</Option>
              <Option value="D">D</Option>
            </Select>
          )}
        </FormItem>
        {k && this.state[k] && this.state[k].selectValue && this.state[k].selectValue === 'A' && <FormItem
          {...(formItemLayout)}
          label='输入值'
          required={true}
        >
          {getFieldDecorator(`inputs[${k}]`, {
            rules: [{
              required: true,
              whitespace: true,
              message: "请输入一个值",
            }],
          })(
            <Input style={{ width: 200 }} placeholder="请输入一个值" />
          )}
        </FormItem>}

        {k && this.state[k] && this.state[k].selectValue && this.state[k].selectValue === 'B' && <FormItem
          {...(formItemLayout)}
          label='输入数字'
          required={true}
        >
          {getFieldDecorator(`inputNumbers[${k}]`, {
            rules: [{
              required: true,
              message: "请输入一个数字值",
            }],
          })(
            <InputNumber min={1} max={10} style={{ width: 200 }} placeholder="请输入一个数字值" />
          )}
        </FormItem>}

        {k && this.state[k] && this.state[k].selectValue && this.state[k].selectValue === 'C' && <FormItem
          {...(formItemLayout)}
          label='单选数字'
          required={true}
        >
          {getFieldDecorator(`radioNumbers[${k}]`, {
            rules: [{
              required: true,
              message: "请选择一个数字",
            }],
          })(
            <RadioGroup name="radiogroup">
              <Radio value={1}>1</Radio>
              <Radio value={2}>2</Radio>
              <Radio value={3}>3</Radio>
              <Radio value={4}>4</Radio>
            </RadioGroup>
          )}
        </FormItem>}

        {k && this.state[k] && this.state[k].selectValue && this.state[k].selectValue === 'D' && <FormItem
          {...(formItemLayout)}
          label='多选字母'
          required={true}
        >
          {getFieldDecorator(`checkLetters[${k}]`, {
            rules: [{
              required: true,
              message: "请选择一个或多个字母",
            }],
          })(
            <Checkbox.Group style={{ width: '100%' }}>
              <Checkbox value="A">A</Checkbox>
              <Checkbox value="B">B</Checkbox>
              <Checkbox value="C">C</Checkbox>
              <Checkbox value="D">D</Checkbox>
            </Checkbox.Group>
          )}
        </FormItem>}

        {keys.length > 1 ? (
          <FormItem {...formItemLayoutWithOutLabel}>
            <Button type="danger" onClick={() => this.remove(k)}>
              <Icon type="minus" /> 删除
         </Button>
          </FormItem>
        ) : null}

      </div>
    ));
    return (
      <Form onSubmit={this.handleSubmit}>
        {formItems}
        <FormItem {...formItemLayoutWithOutLabel}>
          <Button type="dashed" onClick={this.add} style={{ width: 200 }}>
            <Icon type="plus" /> 增加
          </Button>
        </FormItem>
        <FormItem {...formItemLayoutWithOutLabel}>
          <Button type="primary" htmlType="submit">Submit</Button>
        </FormItem>
      </Form>
    );
  }
}
const App = Form.create()(AppFrom);

export default App;