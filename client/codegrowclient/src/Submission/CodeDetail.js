/*
 * @Author: Anscor
 * @Date: 2020-04-14 12:49:10
 * @LastEditors: Anscor
 * @LastEditTime: 2020-04-14 19:13:04
 * @Description: 代码详情
 */

import React from 'react'
import { Divider } from 'antd';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { githubGist } from 'react-syntax-highlighter/dist/esm/styles/hljs';

const compileErrorInfo = submission => {
    let reg = /[0-9_]*.c:/;
    if (submission.language === "C++")
        reg = /[0-9_]*.cpp:/;
    const f = submission.compileErrorInfo.match(reg);
    let lines = submission.compileErrorInfo.split(f);
    lines.shift();
    let i = 0;
    return lines.map(line => <p key={i++}>{line}</p>);
};

export default props => {
    const ce = props.submission.result === "Compile Error";
    const codeHeiht = ce ? "70%" : "100%";
    return (
        <div className="code-detial-box">
            <div className="code-detail" style={{ height: codeHeiht }}>
                <SyntaxHighlighter
                    style={githubGist}
                    showLineNumbers
                    language="cpp">
                    {props.submission.code}
                </SyntaxHighlighter>
            </div>
            {ce && <div className="code-compile-error-box">
                <Divider />
                <div className="code-compile-error">
                    {compileErrorInfo(props.submission)}
                </div>
            </div>}
        </div>
    );
};
