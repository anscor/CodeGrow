/*
 * @Author: Anscor
 * @Date: 2020-04-14 19:15:01
 * @LastEditors: Anscor
 * @LastEditTime: 2020-04-20 20:40:56
 * @Description: 代码纯文本对比
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
                {fixedLineNumber(line[props.kind + "LineNumber"],
                    props.cmps[props.cmps.length - 1][props.kind + "LineNumber"])}
            </span>
            <span
                key={props.kind + line.order + "symbol"}
                style={{
                    marginLeft: "10px",
                }}>
                {(line[props.kind + "Symbol"] === "d" ? "-" :
                    (line[props.kind + "Symbol"] === "a" ? "+" : " ")) + "\n"}
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

const codeColor = (codes, line, kind) => {
    if (!codes) return "white";
    const arr = kind === "old" ? "oldSymbol" : "newSymbol";
    if (codes[line][arr] === "d") return "#ffeef0";
    else if (codes[line][arr] === "a") return "#e6ffed";
    else return "white";
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
        const pre = document.getElementsByClassName("code-cmp-pre")[0];
        const now = document.getElementsByClassName("code-cmp-now")[0];
        let isPre = false, isNow = false;
        if (!pre || !now) return;
        pre.addEventListener("mouseenter", () => {
            isPre = true;
        });
        pre.addEventListener("scroll", () => scrollFunc(pre, now, isPre));
        pre.addEventListener("mouseleave", () => {
            isPre = false;
        })
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
                    className="code-cmp-pre">
                    <SyntaxHighlighter
                        language="cpp"
                        wrapLines={true}
                        PreTag={PreWithLine}
                        cmps={props.cmps}
                        kind="old"
                        lineProps={lineNumber => {
                            let style = {
                                background: codeColor(props.cmps,
                                    lineNumber - 1, "old"),
                                display: "block"
                            };
                            return { style: style, className: "code-line" };
                        }}
                        style={githubGist}>
                        {showCode(props.cmps, "old")}
                    </SyntaxHighlighter>
                </div>
                <div
                    className="code-cmp-now">
                    <SyntaxHighlighter
                        language="cpp"
                        wrapLines={true}
                        PreTag={PreWithLine}
                        cmps={props.cmps}
                        kind="new"
                        lineProps={lineNumber => {
                            let style = {
                                background: codeColor(props.cmps,
                                    lineNumber - 1, "new"),
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
