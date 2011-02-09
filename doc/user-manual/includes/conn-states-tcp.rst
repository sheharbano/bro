.. list-table:: State Summaries for TCP Connections
    :widths: 5 95
    :header-rows: 1

    * - State
      - Description

    * - REJ
      - Connection attempt rejected by responder.

    * - RSTO
      - Connection established, originator aborted.

    * - RSTR
      - Connection established, responder aborted.

    * - RSTS0
      - Originator sent a SYN followed by a RST, but no SYN ACK from
        the responder seen in between.

    * - RSTRH
      - Responder sent a SYN ACK followed by a RST, but not SYN from
        the (purported) originator.

    * - S0
      - Connection attempt seen, but no reply.

    * - S1
      - Connection established, but no termination seen.

    * - S2
      - Connection established and close attempt by originator seen,
        but no reply from responder.

    * - S3
      - Connection established and close attempt by responder seen,
        but not reply to that from originator.

    * - SH
      - A half-open connection, i.e., the originator sent a SYN
        followed by a FIN, but no SYN ACK from the responder seen.

    * - SHR
      - Responder sent a SYN ACK followed by a FIN, but no SYN from the originator.

    * - SF
      - Normal establishment and termination.

    * - OTH
      - None of the above.
