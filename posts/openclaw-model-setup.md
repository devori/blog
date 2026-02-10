---
title: "OpenClaw 모델 연결 가이드: 무료로 시작해서 똑똑하게 확장하기"
date: "2026-02-10"
excerpt: "Gemini 무료 티어를 메인으로 쓰면서, 필요할 때만 Claude Opus로 전환하는 스마트한 AI 비서 세팅법"
---

# OpenClaw 모델 연결 가이드: 무료로 시작해서 똑똑하게 확장하기

AI 비서를 사용하면서 가장 고민되는 건 **'성능'**과 **'비용'**의 균형이다. 최고급 모델을 쓰자니 비용이 부담되고, 무료 모델만 쓰자니 가끔 아쉬울 때가 있다.

OpenClaw는 이런 고민을 해결하는 **Failover(자동 전환)** 기능을 제공한다. 이 글에서는 Gemini의 무료 티어를 메인으로 쓰면서, 한도에 도달하면 자동으로 Claude Opus로 전환되는 설정법을 알아본다.

## 왜 모델을 여러 개 연결해야 할까?

단일 모델만 사용하면 다음과 같은 문제가 생긴다:

- **무료 모델**: Rate Limit에 걸리면 응답 불가
- **유료 모델**: 단순한 질문에도 비용 발생

여러 모델을 연결하면 **무료로 대부분의 작업을 처리**하고, **정말 필요할 때만 프리미엄 모델**을 사용할 수 있다.

## Gemini Free Tier: 생각보다 넉넉하다

Google Gemini API의 무료 티어 한도:

| 항목 | 한도 |
|------|------|
| 분당 요청 (RPM) | 15회 |
| 일일 요청 (RPD) | 1,500회 |
| 분당 토큰 (TPM) | 100만 |

하루 1,500번이면 혼자 쓰기엔 충분하다. 다만 **분당 15회** 제한이 있어서, 코딩처럼 도구를 자주 호출하는 작업에서는 가끔 막힐 수 있다.

## Claude Opus: 든든한 백업

Gemini가 막혔을 때 등판할 Claude Opus 4.5의 가격:

- **Input**: $5/MTok (100만 토큰당 5달러)
- **Output**: $25/MTok

비싸 보이지만, Fallback으로만 쓰면 월 몇 달러 수준이다. 그리고 Opus는 **정말 어려운 작업**에서 빛을 발한다.

## 설정 방법: 3분이면 끝

OpenClaw 설정 파일(`~/.openclaw/openclaw.json`)을 열고 다음과 같이 수정한다:

```json
{
  "agents": {
    "defaults": {
      "model": {
        "primary": "google/gemini-3-flash-preview",
        "fallbacks": ["anthropic/claude-opus-4-5"]
      }
    }
  }
}
```

또는 CLI로 간단하게:

```bash
openclaw configure
# 모델 설정에서 primary와 fallbacks 지정
```

## 작동 원리

1. 평소에는 **Gemini Flash**가 모든 요청 처리
2. Rate Limit이나 오류 발생 시 **자동으로 Claude Opus로 전환**
3. Gemini가 복구되면 다시 Gemini 사용

사용자는 아무것도 신경 쓸 필요 없다. OpenClaw가 알아서 처리한다.

## 토큰 최적화 팁

비용을 더 아끼고 싶다면:

### 1. Compaction 활용
OpenClaw는 대화가 길어지면 자동으로 오래된 내용을 압축한다. `compaction.mode: "safeguard"`가 기본값.

### 2. 불필요한 도구 호출 줄이기
매번 파일을 읽지 말고, 필요한 정보만 요청하자.

### 3. Prompt Caching (Claude)
Claude API 사용 시 동일한 시스템 프롬프트는 캐싱되어 비용이 90% 절감된다.

## 마무리

이 설정으로 나는 **월 비용 거의 0원**으로 AI 비서를 운영하고 있다. Gemini 무료 티어가 대부분의 작업을 커버하고, 가끔 복잡한 코딩이나 긴 문서 작업에서만 Opus가 등판한다.

비용 걱정 없이 AI 비서를 마음껏 활용해보자. 🚀
