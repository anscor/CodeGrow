/*
 * @Author: Anscor
 * @Date: 2020-05-01 17:13:18
 * @LastEditors: Anscor
 * @LastEditTime: 2020-05-03 09:36:31
 * @Description: 代码语法成分对比
 */

import React, { useEffect } from 'react'
import SyntaxHighlighter from 'react-syntax-highlighter'
import { githubGist } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { Skeleton } from 'antd';

const fixedLineNumber = (lineNumber, maxNumber) => {
    lineNumber = lineNumber || "";
    maxNumber = maxNumber || "";
    return lineNumber.toString().padEnd(maxNumber.toString().length);
};

const CodeLine = props => {
    if (!props.cmps) return null;
    return (<code style={{
        float: "left",
        paddingRight: "10px"
    }}>
        {props.cmps.map(line => <span
            key={props.kind + line.order + "box"} style={{
            }}>
            <span
                key={props.kind + line.order}
                style={{
                    color: "rgba(27,31,35,.3)",
                }}
                className="react-syntax-highlighter-line-number">
                {fixedLineNumber(
                    line[props.kind + "LineNumber"],
                    props.cmps[props.cmps.length - 1][props.kind + "LineNumber"]
                ) + "\n"}
            </span>
        </span>)}
    </code>);
};

const PreWithLine = props => {
    return <pre style={{
        display: "block",
        background: "white",
        padding: "0.5em",
        color: "#333333",
        overflowX: "auto"
    }}>
        <CodeLine cmps={props.cmps} kind={props.kind} />
        {props.children}
    </pre>
};

const showCode = (codes, kind) => {
    if (!codes) return "";
    return codes.reduce((prev, curr) => {
        if (curr[kind + "Line"]) return prev + "\n" + curr[kind + "Line"];
        else return prev + "\n";
    }, "").substr(1);
};

const codeColor = (codes, line) => {
    if (!codes || codes[line].isSame) return "white";
    return "#ffeef0";
};

const scrollFunc = (one, other, isIn) => {
    if (!isIn) return;
    other.scrollTop = one.scrollTop;
    const ch1 = one.getElementsByTagName("pre")[0].clientWidth;
    const ch2 = other.getElementsByTagName("pre")[0].clientWidth;
    const scale = (ch2 - other.clientWidth) / (ch1 - one.clientWidth);
    other.scrollLeft = one.scrollLeft * scale;
};

export default props => {
    useEffect(() => {
        const pre = document.getElementsByClassName("code-cmp-pre syntax")[0];
        const now = document.getElementsByClassName("code-cmp-now syntax")[0];
        let isPre = false, isNow = false;
        if (!pre || !now) return;
        pre.scrollTop = 0;
        pre.scrollLeft = 0;
        now.scrollLeft = 0;
        now.scrollTop = 0;
        pre.addEventListener("mouseenter", () => {
            isPre = true;
        });
        pre.addEventListener("scroll", () => scrollFunc(pre, now, isPre));
        pre.addEventListener("mouseleave", () => {
            isPre = false;
        });
        now.addEventListener("mouseenter", () => {
            isNow = true;
        });
        now.addEventListener("scroll", () => scrollFunc(now, pre, isNow));
        now.addEventListener("mouseleave", () => {
            isNow = false;
        });
    });
    return (
        <Skeleton loading={props.cmps === undefined}>
            <div className="code-cmp-box">
                <div
                    className="code-cmp-pre syntax">
                    <p>上一版本</p>
                    <SyntaxHighlighter
                        language="cpp"
                        wrapLines={true}
                        PreTag={PreWithLine}
                        cmps={props.cmps}
                        kind="old"
                        lineProps={lineNumber => {
                            let style = {
                                background: codeColor(props.cmps,
                                    lineNumber - 1),
                                display: "block"
                            };
                            return { style: style, className: "code-line" };
                        }}
                        style={githubGist}>
                        {showCode(props.cmps, "old")}
                    </SyntaxHighlighter>
                </div>
                <div
                    className="code-cmp-now syntax">
                    <p>当前版本</p>
                    <SyntaxHighlighter
                        language="cpp"
                        wrapLines={true}
                        PreTag={PreWithLine}
                        cmps={props.cmps}
                        kind="new"
                        lineProps={lineNumber => {
                            let style = {
                                background: codeColor(props.cmps,
                                    lineNumber - 1),
                                display: "block"
                            };
                            return { style: style, className: "code-line" };
                        }}
                        style={githubGist}>
                        {showCode(props.cmps, "new")}
                    </SyntaxHighlighter>
                </div>
            </div >
        </Skeleton>
    );
}
