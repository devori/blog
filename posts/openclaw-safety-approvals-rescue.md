---
title: "OpenClaw 안전 운영 한 번에 이해하기: 삭제 실수 방지 + Rescue 복구"
date: 2026-02-25
lang: "ko"
excerpt: "삭제는 가장 비싼 실수다. 이 글은 approvals(브레이크)로 삭제 사고를 줄이고, rescue 프로필로 꼬였을 때 안전하게 복구하는 최소 운영 루틴을 정리한다."
tags: ["openclaw", "ops", "safety"]
series: "OpenClaw 운영"
series_no: 2
---


> 시리즈: OpenClaw 운영
> - 1편: [업무/개인 비서 분리(프로필 2개)](/posts/openclaw-profiles-work-personal)
> - 2편 ✅ 현재: 안전 운영(브레이크 + 복구)

비서가 강해질수록 실수의 반경도 커진다. 그중에서도 “삭제”는 가장 비싼 실수다. 대개 너무 늦게 알아차리기 때문이다.

이 글은 OpenClaw 안전 운영을 딱 두 가지로 정리한다.

- **승인(approvals) = 브레이크**: 실수로 삭제하지 않게 막는다
- **rescue 프로필 = 응급실**: 꼬였을 때 메인을 건드리지 않고 복구한다

---

## 한 문장 요약

OpenClaw 안전은 두 겹이 같이 작동할 때 가장 세다.

1) **tool policy**: 필요 없는 도구를 아예 못 쓰게(특히 personal)
2) **exec approvals**: 호스트 명령을 allowlist/승인으로 제어

삭제 같은 사이드이펙트는 기본값을 ask(확인)로 두면 사고가 확 줄어든다. 그리고 rescue 프로필을 하나 따로 두면, 꼬였을 때 “고치려다 더 망치는” 일을 줄일 수 있다.

---

## 사고 시나리오: Downloads 정리하다가 날아가는 순간

당신은 이렇게 말한다: “Downloads 폴더 30일 지난 파일 정리해줘.” 비서는 선의로 움직인다.

하지만 삭제 명령은 한 번의 오해/실수/와일드카드(*)만으로 ‘복구가 어려운 사고’가 된다.
문제는 비서가 멍청해서가 아니라, 시스템에 브레이크가 없어서다.

---

## 기본 개념: allow / ask / deny

이 세 가지를 “버튼 3개”라고 생각하면 쉽다.

- **allow** = 자동 실행(질문/확인 없이)
- **ask** = 실행 전에 확인(승인)
- **deny** = 애초에 실행 불가

삭제는 기본값을 ask로 두는 편이 안전하다.
반면 “목록 보기/크기 계산/요약” 같은 무해한 단계는 allow로 두어도 보통 괜찮다.

---

## 브레이크는 2겹이다

### 1) Tool policy: 어떤 도구를 아예 못 쓰게

가장 쉬운 규칙은 이거다.

- personal(개인) 비서: `exec`가 필요 없으면 **deny로 꺼버린다**
- work(업무) 비서: `exec`가 필요할 수 있지만, 아래 exec approvals로 강하게 제어한다

필요 없는 도구는 “조심해서 쓰기”가 아니라 “아예 없는 도구”로 만드는 게 가장 싸고 확실하다.

### 2) Exec approvals: “호스트에서 실행되는 명령”을 allowlist/승인으로 제어

exec가 켜져 있어도, exec approvals를 allowlist/ask로 설정하면 “허용된 것만 자동 실행, 나머지는 승인 필요”가 된다.

```plain text
defaults.security = deny
agents.main.security = allowlist
ask = on-miss
askFallback = deny
```

뜻:
- 기본은 거부
- 명시적으로 허용한 것만
- 처음 보는 명령은 물어보고
- 승인 UI가 없으면(원격/자리 비움) 그냥 거부

---

## 삭제 사고 3종 세트(로컬 파일) — 이 3개만 막아도 체감이 난다

삭제 사고는 대부분 “삭제 자체”가 아니라, 삭제 대상이 슬쩍 바뀌는 순간에 난다.

- **① 경로 착각**: Downloads를 정리한다고 했는데 Desktop/Document를 건드린다
- **② 묶음/필터 확장**: “오래된 것만”이 “거의 전부”로 확장된다
- **③ 동명이인 파일**: 비슷한 이름 사이에 중요한 파일이 섞여 있는데 한 번에 처리한다

목표는 “삭제를 못 하게”가 아니라, “삭제 전엔 반드시 목록/합계/확인문구”를 거치게 만드는 것이다.

---

## 삭제 안전 레시피(로컬 파일)

1) 삭제는 **2-step**으로만:
- 1단계: 대상 목록(전체 경로+용량 포함)
- 2단계: 확인 문구 입력 후 실행

2) 가능하면 **영구삭제 대신 휴지통(Trash) 이동**을 기본으로

3) 폴더 통째/와일드카드 삭제는 “리스트+개수” 없으면 승인하지 않는다

4) 확인 문구는 **개수+폴더** 포함:
- `DELETE 12 FILES FROM DOWNLOADS`

---

## 삭제 안전 체크리스트(복붙)

> 삭제는 “실행”이 아니라 “확인 프로세스”다.

1) 후보 목록 출력(경로+용량)
2) 합계 출력(총 개수+총 용량)
3) 가장 큰 파일 Top 3 확인(여기서 사고가 많이 잡힘)
4) Trash 이동인지 확인(영구삭제 금지)
5) 확인 문구 입력(개수+폴더 포함)

템플릿:

```plain text
(삭제 요청 템플릿)

- 대상 폴더: ~/Downloads
- 기준: 30일 이상 지난 파일
- 방식: 영구삭제 금지, 휴지통(Trash)으로 이동
- 출력 요구:
  1) 후보 목록(파일명 + 전체 경로 + 용량)
  2) 합계(총 파일 수 + 총 용량)
  3) 위험요소(가장 큰 파일 Top 3)
- 실행 조건:
  - 내가 아래 확인 문구를 그대로 입력하면 실행
  - 확인 문구에는 “개수 + 폴더”가 포함되어야 함

확인 문구 예시:
DELETE 12 FILES FROM DOWNLOADS
```

---

## 대화 예시(복붙)

```plain text
나: Downloads 폴더 30일 지난 파일 정리해줘.

비서(1단계): ~/Downloads에서 30일 지난 후보 12개를 찾았어:
- IMG_1023.png (3.1 MB)
- screen-recording.mov (820 MB)
- ...
합계: 12개, 약 1.3 GB

비서(2단계): 아래 문구를 정확히 그대로 답장하면 휴지통으로 이동할게:
DELETE 12 FILES FROM DOWNLOADS

(또는: CANCEL)
```

---

## 10분 설정(최소)

여기서는 “브레이크를 설치하는 최소 단계”만 적는다.

### Step 1) 현재 exec approvals 상태 보기

```bash
openclaw approvals get
openclaw approvals get --gateway
```

### Step 2) allowlist는 “점검/관찰용”만 최소로

```bash
# 안전한 편의(점검용)만 allowlist에 넣는다:
openclaw approvals allowlist add --agent main "/bin/ls"
openclaw approvals allowlist add --agent main "/usr/bin/du"

# /bin/rm 같은 삭제 명령은 allowlist에 넣지 않는다.
# 삭제는 항상 ‘승인’ 단계를 거치게 둔다.
```

### Step 3) 가능하면 personal(개인)에서는 exec를 꺼버리기

```bash
openclaw --profile personal config set tools.deny '["exec"]' --json
```

---

## 2부) 꼬였을 때 복구하는 방법: Rescue 프로필

승인(브레이크)이 “사고를 예방”하는 장치라면, rescue 프로필은 “사고가 났을 때 복구”하는 장치다.

### Rescue가 필요한 흔한 상황 5가지

- 봇이 답장을 안 한다(토큰/페어링/채널 설정 문제)
- 포트가 겹친다(프로필 여러 개 운용 시 흔함)
- 정책/승인 설정을 만지다 “아무것도 실행이 안 되는 상태”가 된다
- 도구/모델/환경이 늘어나면서 어디서 문제가 나는지 추적이 어려워진다
- 급하게 고치다 더 꼬인다(원인 분리 없이 연쇄 수정)

> 원칙: 메인을 더 만지기 전에, rescue로 “상태 확인 → 원인 좁히기”부터 한다.

### 10분 설정: rescue 프로필 만들기(최소 구성)

```bash
openclaw --profile rescue setup

# 메인과 포트를 반드시 분리
openclaw --profile rescue gateway --port 19789
```

팁: 포트는 20 이상 간격을 두면 충돌이 줄어든다.

### 복구 루틴(복붙 체크리스트)

1) **일단 멈춘다**: 메인 설정을 더 건드리지 않는다(연쇄 수정 금지)
2) **rescue를 켠다**
3) **상태 확인**: 어느 프로필이 살아 있고 죽었는지부터 구분

```bash
openclaw --profile rescue status
openclaw --profile work status
openclaw --profile personal status
```

4) **채널/페어링 확인(가장 흔함)**

```bash
openclaw --profile work pairing list telegram
openclaw --profile personal pairing list telegram
```

5) **승인/정책 때문에 막힌 건지 확인**

```bash
openclaw approvals get
openclaw approvals get --gateway
```

자리 비움/원격 상황에서는 `askFallback=deny`를 추천한다. “승인 UI 없음 = 실행 안 함”으로 사고를 막는다.

---

## 한 줄 결론 + 오늘 당장 할 3가지

> 브레이크(승인/정책)로 “사고를 예방”하고, rescue 프로필로 “꼬였을 때 복구”한다 — 둘 다 있어야 운영이 편해진다.

오늘 당장 할 3가지만:

1) 삭제는 2-step(목록/합계 → 확인 문구)으로만
2) personal은 exec 끄기(가능하면)
3) rescue 프로필 만들고, 꼬이면 rescue로 상태 확인부터

---

## FAQ(브레이크 + 복구)

- Q. 느려지지 않나?
  - A. “목록/요약/계획”은 빠르게, “삭제/실행”만 느리게 만드는 게 목적이다. 비싼 실수만 늦춘다.

- Q. 자리에 없으면?
  - A. `askFallback=deny`로 두면 “승인 UI 없음 = 실행 안 함”이 된다.

- Q. 비서를 믿어도 필요하나?
  - A. 필요하다. 신뢰는 흔들리지만, 가드레일은 흔들리지 않는다.
