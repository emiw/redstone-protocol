# Protocol

The key words "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT", "SHOULD", "SHOULD NOT", "RECOMMENDED",  "MAY", and
"OPTIONAL" in this document are to be interpreted as described in RFC 2119.

A large portion of this (especially the data types) are inspired by [the Minecraft protocol][mc-protocol] and by extension [protobuf][]

Data Types:

| Name | Size (bytes) | Encoding | Notes |
|------|--------------|----------|-------|
| VarInt | >= 1, <= 5 | Integer | Just a [protobuf VarInt][VarInt] |
| Single-Byte Number | 1 | An integer, simply encoded as a base 2 number | I'm sure there's a more technical name for this |
| ByteArray | >= 1, <= ~2 billion  | A series of bytes with its length prefixed as a VarInt | None |
| String | >= 1, <= ~2 billion | A ByteArray with a UTF-8 string | None |

Each packet MUST have the following fields:

| Name               | Encoding           | Value                        | Notes                                |
|--------------------|--------------------|------------------------------|--------------------------------------|
| length | VarInt | Length of the remainder of the packet | MUST NOT be zero (that wouldn't make any sense!) |
| friendID | Single-Byte Number | Relevant friend | If zero, the packet MUST be relevant to the entire connection and to no specific friend, and MUST NOT have a `data` section, and MUST have a `ctrl` section |
| ctrl | String | Information regarding the app itself, such as state, events, etc. | MUST BE UTF-8 Encoded JSON. If of zero length, then there MUST be a `data` section |
| data | ByteArray | Data to be passed through to/from Minecraft. | If of zero length, then there MUST be a `ctrl` section, and `friendID` MUST NOT be zero. |

[mc-protocol]: http://wiki.vg/Protocol "Minecraft Protocol"
[protobuf]: https://developers.google.com/protocol-buffers "protobuf"
[VarInt]: https://developers.google.com/protocol-buffers/docs/encoding#varints "VarInts"
